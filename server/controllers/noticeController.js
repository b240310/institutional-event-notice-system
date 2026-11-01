const Notice = require('../models/Notice');

/**
 * @desc    Get all notices with search, filter (category, priority) and pagination
 * @route   GET /api/notices
 * @access  Private / Authenticated
 */
const getNotices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Filter by priority
    if (req.query.priority && req.query.priority !== 'all') {
      query.priority = req.query.priority;
    }

    // Search query on title and description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Optional: filter only non-expired notices unless requested
    if (req.query.includeExpired !== 'true') {
      query.$or = [
        ...(query.$or || []),
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ];
      // If $or had search items and we also want expiry, combine via $and if necessary
      if (req.query.search) {
        query.$and = [
          {
            $or: [
              { title: { $regex: req.query.search, $options: 'i' } },
              { description: { $regex: req.query.search, $options: 'i' } }
            ]
          },
          {
            $or: [
              { expiryDate: null },
              { expiryDate: { $gte: new Date() } }
            ]
          }
        ];
        delete query.$or;
      }
    }

    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .populate('postedBy', 'name email role department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: notices.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      notices
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single notice by ID
 * @route   GET /api/notices/:id
 * @access  Private / Authenticated
 */
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      'postedBy',
      'name email role department'
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      notice
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new notice
 * @route   POST /api/notices
 * @access  Private (Admin, Faculty)
 */
const createNotice = async (req, res, next) => {
  try {
    const { title, description, category, priority, expiryDate } = req.body;

    const notice = await Notice.create({
      title,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      postedBy: req.user._id
    });

    const populatedNotice = await Notice.findById(notice._id).populate(
      'postedBy',
      'name email role department'
    );

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      notice: populatedNotice
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a notice
 * @route   PUT /api/notices/:id
 * @access  Private (Admin or Owner Faculty)
 */
const updateNotice = async (req, res, next) => {
  try {
    let notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Role check: Only admin or the notice creator can update
    if (
      req.user.role !== 'admin' &&
      notice.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this notice'
      });
    }

    const { title, description, category, priority, expiryDate } = req.body;

    if (title) notice.title = title;
    if (description) notice.description = description;
    if (category) notice.category = category;
    if (priority) notice.priority = priority;
    if (expiryDate !== undefined) {
      notice.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    const updatedNotice = await notice.save();
    const populated = await Notice.findById(updatedNotice._id).populate(
      'postedBy',
      'name email role department'
    );

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      notice: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a notice
 * @route   DELETE /api/notices/:id
 * @access  Private (Admin or Owner Faculty)
 */
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Role check: Only admin or the notice creator can delete
    if (
      req.user.role !== 'admin' &&
      notice.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this notice'
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
};

