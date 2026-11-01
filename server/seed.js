const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Notice = require('./models/Notice');
const Event = require('./models/Event');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/institutional_board';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany();
    await Notice.deleteMany();
    await Event.deleteMany();
    console.log('[Seeder] Cleared existing data');

    // 1. Create Users (User pre-save will hash passwords)
    const users = await User.create([
      {
        name: 'Dr. Arthur Mitchell (Admin)',
        email: 'admin@institution.edu',
        password: 'Password@123',
        role: 'admin',
        department: 'Central Administration'
      },
      {
        name: 'Prof. Rajesh Sharma',
        email: 'prof.sharma@institution.edu',
        password: 'Password@123',
        role: 'faculty',
        department: 'Computer Science & Engineering'
      },
      {
        name: 'Dr. Ananya Iyer',
        email: 'dr.iyer@institution.edu',
        password: 'Password@123',
        role: 'faculty',
        department: 'Electronics & Communication'
      },
      {
        name: 'Aravind Swaminathan',
        email: 'aravind@student.edu',
        password: 'Password@123',
        role: 'student',
        department: 'Computer Science & Engineering'
      },
      {
        name: 'Priya Sundaram',
        email: 'priya@student.edu',
        password: 'Password@123',
        role: 'student',
        department: 'Information Technology'
      },
      {
        name: 'Rohit Verma',
        email: 'rohit@student.edu',
        password: 'Password@123',
        role: 'student',
        department: 'Computer Science & Engineering'
      }
    ]);

    const adminUser = users[0];
    const faculty1 = users[1];
    const faculty2 = users[2];
    const student1 = users[3];
    const student2 = users[4];
    const student3 = users[5];

    console.log(`[Seeder] Seeded ${users.length} users`);

    // 2. Create Notices
    const notices = await Notice.create([
      {
        title: 'Fall Semester End-Term Examination Schedule',
        description:
          'The final semester examinations for all undergraduate and postgraduate programs commence from December 5th. Detailed timetable and hall ticket download links are available on the student portal.',
        category: 'academic',
        priority: 'high',
        postedBy: adminUser._id,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Campus Wi-Fi Infrastructure Upgrade & Scheduled Maintenance',
        description:
          'The central IT cell will perform network maintenance on Sunday between 02:00 AM and 06:00 AM. Internet and intranet services may be temporarily unreachable during this window.',
        category: 'administrative',
        priority: 'medium',
        postedBy: faculty1._id,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Annual Inter-College Sports Fest - IGNITE 2026',
        description:
          'Registrations are officially open for IGNITE 2026! Tournaments include Football, Cricket, Badminton, Table Tennis, and Chess. Contact sports coordinators at the Gymnasium for team entries.',
        category: 'sports',
        priority: 'medium',
        postedBy: faculty2._id,
        expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Call for Papers: AI & Cloud Computing Symposium',
        description:
          'Faculty and students are invited to submit original research papers for the upcoming National Symposium on Applied Generative AI. Selected papers will be indexed in IEEE Xplore.',
        category: 'academic',
        priority: 'high',
        postedBy: faculty1._id,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Diwali & Cultural Night - Tarang 2026',
        description:
          'Join us for an evening of music, dance, theatrical acts, and food stalls at the Open Air Amphitheatre on Friday evening starting at 6:00 PM.',
        category: 'cultural',
        priority: 'low',
        postedBy: adminUser._id,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Library Hours Extended for Examination Preparation',
        description:
          'The Central Library reading rooms will remain open 24/7 starting from next Monday until the conclusion of term examinations.',
        category: 'general',
        priority: 'low',
        postedBy: adminUser._id,
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log(`[Seeder] Seeded ${notices.length} notices`);

    // 3. Create Events
    const events = await Event.create([
      {
        title: 'Full Stack Web & Cloud Hackathon 2026',
        description:
          'A 36-hour non-stop hackathon challenging teams to build scalable cloud-native solutions. Mentors from top tech firms will be present. Cash prizes and internship interview vouchers for winners.',
        venue: 'Innovation & Incubation Hub, Block B',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
        time: '09:00 AM',
        organizer: faculty1._id,
        capacity: 50,
        registeredUsers: [student1._id, student2._id, student3._id],
        status: 'upcoming'
      },
      {
        title: 'Industry Guest Lecture: Microservices & Distributed Systems',
        description:
          'Guest lecture by Senior Architect at Google Cloud discussing high-availability architectures, Kubernetes orchestration, and event-driven microservices.',
        venue: 'Auditorium Hall 1',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // In 10 days
        time: '02:30 PM',
        organizer: faculty1._id,
        capacity: 120,
        registeredUsers: [student1._id, student3._id],
        status: 'upcoming'
      },
      {
        title: 'Hands-on Workshop: VLSI & Embedded Systems',
        description:
          'Practical workshop covering FPGA synthesis, Verilog programming, and IoT interfacing with STM32 microcontrollers.',
        venue: 'Electronics Hardware Lab 3',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 14 days
        time: '10:00 AM',
        organizer: faculty2._id,
        capacity: 35,
        registeredUsers: [student2._id],
        status: 'upcoming'
      },
      {
        title: 'Orientation & Welcome Ceremony for New Admissions',
        description:
          'Institutional orientation, department tour, and address by the Dean & Director followed by high tea at the cafeteria.',
        venue: 'Main Campus Convention Center',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        time: '10:00 AM',
        organizer: adminUser._id,
        capacity: 300,
        registeredUsers: [student1._id, student2._id, student3._id],
        status: 'completed'
      },
      {
        title: 'Inter-College RoboWars Championship',
        description:
          'Combat robotics competition across 15kg and 30kg categories with custom arena traps and obstacle courses.',
        venue: 'Indoor Sports Complex',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // In 25 days
        time: '11:00 AM',
        organizer: faculty2._id,
        capacity: 40,
        registeredUsers: [student1._id],
        status: 'upcoming'
      }
    ]);

    console.log(`[Seeder] Seeded ${events.length} events`);
    console.log('\n=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Credentials (all accounts use password: Password@123):');
    console.log('1. Admin:   admin@institution.edu');
    console.log('2. Faculty: prof.sharma@institution.edu');
    console.log('3. Student: aravind@student.edu');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();

