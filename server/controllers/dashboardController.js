const User = require('../models/User');
const Notice = require('../models/Notice');
const Event = require('../models/Event');

/**
 * @desc    Get dashboard metrics, aggregations, and trends
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Counts
    const [totalUsers, totalNotices, totalEvents] = await Promise.all([
      User.countDocuments(),
      Notice.countDocuments(),
      Event.countDocuments()
    ]);

    // 2. Users grouped by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Notices grouped by category
    const noticesByCategory = await Notice.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 4. Upcoming events (next 5)
    const upcomingEvents = await Event.find({
      date: { $gte: today },
      status: { $ne: 'cancelled' }
    })
      .populate('organizer', 'name email department')
      .sort({ date: 1 })
      .limit(5);

    // 5. Total registrations across all events
    const registrationAgg = await Event.aggregate([
      {
        $project: {
          registrationCount: { $size: { $ifNull: ['$registeredUsers', []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: '$registrationCount' }
        }
      }
    ]);
    const totalRegistrations =
      registrationAgg.length > 0 ? registrationAgg[0].totalRegistrations : 0;

    // 6. Aggregation: Events per month
    const eventsPerMonth = await Event.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Format eventsPerMonth for easy chart consumption
    const monthNames = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const formattedEventsPerMonth = eventsPerMonth.map((item) => ({
      label: `${monthNames[item._id.month]} ${item._id.year}`,
      year: item._id.year,
      month: item._id.month,
      count: item.count
    }));

    // 7. Aggregation: Registrations per event (top 6 by registrations)
    const registrationsPerEvent = await Event.aggregate([
      {
        $project: {
          title: 1,
          capacity: 1,
          date: 1,
          status: 1,
          registrationsCount: { $size: { $ifNull: ['$registeredUsers', []] } }
        }
      },
      { $sort: { registrationsCount: -1, date: -1 } },
      { $limit: 6 }
    ]);

    // 8. Recent Notices (latest 5)
    const recentNotices = await Notice.find()
      .populate('postedBy', 'name department role')
      .sort({ createdAt: -1 })
      .limit(5);

    // 9. If the caller is a faculty member, get their specific stats
    let facultyStats = null;
    if (req.user && req.user.role === 'faculty') {
      const myNoticesCount = await Notice.countDocuments({ postedBy: req.user._id });
      const myEventsCount = await Event.countDocuments({ organizer: req.user._id });
      const myEvents = await Event.find({ organizer: req.user._id });
      const myTotalRegistrations = myEvents.reduce(
        (sum, ev) => sum + (ev.registeredUsers ? ev.registeredUsers.length : 0),
        0
      );
      facultyStats = {
        myNoticesCount,
        myEventsCount,
        myTotalRegistrations
      };
    }

    // 10. If the caller is a student, get registered count
    let studentStats = null;
    if (req.user && req.user.role === 'student') {
      const registeredCount = await Event.countDocuments({
        registeredUsers: req.user._id
      });
      studentStats = {
        registeredCount
      };
    }

    res.status(200).json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          notices: totalNotices,
          events: totalEvents,
          registrations: totalRegistrations
        },
        usersByRole,
        noticesByCategory,
        upcomingEvents,
        eventsPerMonth: formattedEventsPerMonth,
        registrationsPerEvent,
        recentNotices,
        facultyStats,
        studentStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};

