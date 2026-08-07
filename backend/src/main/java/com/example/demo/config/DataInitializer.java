package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.BookCopyRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.CourseReserveRepository;
import com.example.demo.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final CourseReserveRepository courseReserveRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin User
        if (!userRepository.existsByEmail("admin@library.com")) {
            User admin = User.builder()
                    .fullName("Head Librarian Admin")
                    .email("admin@library.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Initialized Default Admin: admin@library.com / admin123");
        }

        // Seed Sample Student User
        if (!userRepository.existsByEmail("student@library.com")) {
            User student = User.builder()
                    .fullName("Alex Johnson")
                    .email("student@library.com")
                    .password(passwordEncoder.encode("student123"))
                    .studentIdNumber("STU-2026-001")
                    .role(Role.ROLE_STUDENT)
                    .status(UserStatus.ACTIVE)
                    .maxBorrowLimit(5)
                    .build();
            userRepository.save(student);
            System.out.println(">>> Initialized Default Student: student@library.com / student123");
        }

        // Always seed all curated real books (Ramayana, Mahabharata, Bhagavad Gita, Ponniyin Selvan, Panchatantra, etc.)
        seedComprehensiveCollegeLibrary();

        // Seed additional books up to 1,000 if needed
        if (bookRepository.count() < 1000) {
            seed1000Books();
        }
    }

    private void seedComprehensiveCollegeLibrary() {
        // Create 10 Academic Categories
        Category cs = getOrCreateCategory("Computer Science & IT", "Software engineering, AI, algorithms, web dev, and networking.");
        Category ee = getOrCreateCategory("Electrical & Electronics", "Circuits, microcontrollers, VLSI, signals, and control systems.");
        Category me = getOrCreateCategory("Mechanical Engineering", "Thermodynamics, fluid mechanics, robotics, and machine design.");
        Category math = getOrCreateCategory("Mathematics & Data Science", "Calculus, linear algebra, statistics, and machine learning.");
        Category phys = getOrCreateCategory("Physics & Chemistry", "Quantum mechanics, optics, organic & inorganic chemistry.");
        Category biz = getOrCreateCategory("Business & Management", "Marketing, finance, leadership, operations, and strategy.");
        Category econ = getOrCreateCategory("Economics & Finance", "Microeconomics, macroeconomics, econometrics, and investments.");
        Category med = getOrCreateCategory("Medical & Life Sciences", "Anatomy, physiology, biochemistry, pathology, and genetics.");
        Category civil = getOrCreateCategory("Civil & Architecture", "Structural design, surveying, geotechnical, and urban planning.");
        Category hum = getOrCreateCategory("Literature & Humanities", "Classics, history, philosophy, and critical thinking.");
        Category epics = getOrCreateCategory("Indian Epics, Mythology & Classics", "Sacred Indian epics, Ramayana, Mahabharata, Bhagavad Gita, Panchatantra, and regional masterpieces.");
        Category fiction = getOrCreateCategory("World Fiction & Global Classics", "Global literary masterpieces, modern bestsellers, philosophy, and timeless world classics.");

        System.out.println(">>> Categories initialized. Seeding books...");

        // Category 1: Computer Science & IT (20 books)
        addBook("Clean Code: Refactoring & Testing", "Robert C. Martin", "9780132350884", "Prentice Hall", "1st Edition", 2008, "English", "A Handbook of Agile Software Craftsmanship.", cs, 3);
        addBook("Introduction to Algorithms (CLRS)", "Thomas H. Cormen, Charles E. Leiserson", "9780262033848", "MIT Press", "3rd Edition", 2009, "English", "The standard textbook for algorithm design and data structures.", cs, 4);
        addBook("Design Patterns: Reusable Object-Oriented Software", "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", "9780201633610", "Addison-Wesley", "1st Edition", 1994, "English", "Classic reference on 23 fundamental software engineering patterns.", cs, 3);
        addBook("Artificial Intelligence: A Modern Approach", "Stuart Russell, Peter Norvig", "9780134610993", "Pearson", "4th Edition", 2020, "English", "The most comprehensive introduction to modern AI and machine learning.", cs, 5);
        addBook("Computer Networking: A Top-Down Approach", "James Kurose, Keith Ross", "9780133594140", "Pearson", "7th Edition", 2017, "English", "Clear, internet-focused approach to computer networking concepts.", cs, 3);
        addBook("Operating System Concepts", "Abraham Silberschatz, Peter B. Galvin", "9781118063330", "Wiley", "9th Edition", 2012, "English", "Fundamental concepts of OS processes, memory, and storage management.", cs, 4);
        addBook("Database System Concepts", "Abraham Silberschatz, Henry F. Korth", "9780073523323", "McGraw-Hill", "6th Edition", 2010, "English", "Essential principles of relational databases and SQL query processing.", cs, 3);
        addBook("Compilers: Principles, Techniques, and Tools", "Alfred V. Aho, Monica S. Lam", "9780321486813", "Pearson", "2nd Edition", 2006, "English", "The famous Dragon Book covering compiler construction and lexical analysis.", cs, 2);
        addBook("Modern Operating Systems", "Andrew S. Tanenbaum, Herbert Bos", "9780133591620", "Pearson", "4th Edition", 2014, "English", "Detailed exploration of OS architecture, virtualization, and security.", cs, 3);
        addBook("Computer Architecture: A Quantitative Approach", "John L. Hennessy, David A. Patterson", "9780128119051", "Morgan Kaufmann", "6th Edition", 2017, "English", "Pipelining, instruction-level parallelism, and memory hierarchies.", cs, 3);
        addBook("Python Crash Course", "Eric Matthes", "9781593279288", "No Starch Press", "2nd Edition", 2019, "English", "Fast-paced introduction to programming with Python 3.", cs, 4);
        addBook("The Pragmatic Programmer", "David Thomas, Andrew Hunt", "9780135957059", "Addison-Wesley", "2nd Edition", 2019, "English", "Timeless advice on career, software architecture, and developer effectiveness.", cs, 3);
        addBook("Designing Data-Intensive Applications", "Martin Kleppmann", "9781449373320", "O'Reilly Media", "1st Edition", 2017, "English", "Reliability, scalability, and maintainability of big data systems.", cs, 4);
        addBook("Deep Learning", "Ian Goodfellow, Yoshua Bengio, Aaron Courville", "9780262035613", "MIT Press", "1st Edition", 2016, "English", "The definitive mathematical textbook on neural networks and deep learning.", cs, 3);
        addBook("Structure and Interpretation of Computer Programs", "Harold Abelson, Gerald Jay Sussman", "9780262510875", "MIT Press", "2nd Edition", 1996, "English", "SICP classic on computation principles, abstraction, and interpreters.", cs, 2);
        addBook("Head First Java", "Kathy Sierra, Bert Bates", "9780596009205", "O'Reilly Media", "2nd Edition", 2005, "English", "Brain-friendly guide to object-oriented programming in Java.", cs, 3);
        addBook("You Don't Know JS Yet", "Kyle Simpson", "9781491904244", "O'Reilly Media", "2nd Edition", 2020, "English", "Deep dive into JavaScript core mechanics, scope, closures, and async.", cs, 4);
        addBook("Refactoring: Improving the Design of Existing Code", "Martin Fowler", "9780134757599", "Addison-Wesley", "2nd Edition", 2018, "English", "Code smells and step-by-step refactoring techniques.", cs, 3);
        addBook("Kubernetes Up & Running", "Brendan Burns, Joe Beda", "9781492046530", "O'Reilly Media", "2nd Edition", 2019, "English", "Dive into container orchestration and cloud-native applications.", cs, 3);
        addBook("Computer Networks", "Andrew S. Tanenbaum, David J. Wetherall", "9780132126953", "Pearson", "5th Edition", 2010, "English", "Comprehensive text on OSI and TCP/IP protocol stacks.", cs, 3);

        // Category 2: Electrical & Electronics (20 books)
        addBook("Microelectronic Circuits", "Adel S. Sedra, Kenneth C. Smith", "9780190853464", "Oxford University Press", "8th Edition", 2019, "English", "The standard gold reference for analog and digital circuit design.", ee, 4);
        addBook("Electric Circuits", "James W. Nilsson, Susan Riedel", "9780133760033", "Pearson", "10th Edition", 2014, "English", "Fundamental laws of DC/AC circuits, Laplace transforms, and frequency response.", ee, 3);
        addBook("Fundamentals of Electric Circuits", "Charles K. Alexander, Matthew N.O. Sadiku", "9780078028229", "McGraw-Hill", "6th Edition", 2016, "English", "Student-friendly treatment of electric circuit analysis.", ee, 3);
        addBook("Digital Design: With an Introduction to Verilog HDL", "M. Morris Mano, Michael D. Ciletti", "9780132774208", "Pearson", "5th Edition", 2012, "English", "Logic gates, Boolean algebra, flip-flops, and FPGA logic implementation.", ee, 4);
        addBook("Signals and Systems", "Alan V. Oppenheim, Alan S. Willsky", "9780138147570", "Pearson", "2nd Edition", 1996, "English", "Continuous-time and discrete-time signals, Fourier series, and Z-transforms.", ee, 3);
        addBook("Control Systems Engineering", "Norman S. Nise", "9781118170519", "Wiley", "7th Edition", 2015, "English", "Feedback control systems, root locus, Bode plots, and state-space analysis.", ee, 3);
        addBook("Principles of Electromagnetics", "Matthew N.O. Sadiku", "9780199461851", "Oxford University Press", "6th Edition", 2015, "English", "Maxwell's equations, wave propagation, and transmission lines.", ee, 2);
        addBook("Power System Analysis", "John Grainger, William Stevenson", "9780070612938", "McGraw-Hill", "1st Edition", 1994, "English", "Power generation, load flow analysis, symmetrical components, and stability.", ee, 3);
        addBook("CMOS VLSI Design: A Circuits and Systems Perspective", "Neil Weste, David Harris", "9780321547743", "Addison-Wesley", "4th Edition", 2010, "English", "Silicon layout, transistor sizing, delay optimization, and chip design.", ee, 2);
        addBook("Analog Integrated Circuit Design", "David A. Johns, Kenneth W. Martin", "9780471144489", "Wiley", "2nd Edition", 2011, "English", "Operational amplifiers, noise analysis, switched-capacitor circuits.", ee, 2);
        addBook("Linear Signals and Systems", "B.P. Lathi", "9780195158335", "Oxford University Press", "2nd Edition", 2004, "English", "Comprehensive introduction to signal processing theory.", ee, 3);
        addBook("Semiconductor Physics and Devices", "Donald A. Neamen", "9780073529585", "McGraw-Hill", "4th Edition", 2011, "English", "PN junctions, MOSFETs, BJTs, and carrier transport physics.", ee, 3);
        addBook("Embedded Systems: Architecture, Programming and Design", "Raj Kamal", "9789332901490", "McGraw-Hill Education", "3rd Edition", 2014, "English", "Microcontrollers, RTOS, memory interfacing, and hardware peripherals.", ee, 4);
        addBook("Optical Fiber Communications", "Gerd Keiser", "9780073380711", "McGraw-Hill", "5th Edition", 2013, "English", "Lightwave systems, fiber optics, laser diodes, and optical amplifiers.", ee, 2);
        addBook("Modern Control Engineering", "Katsuhiko Ogata", "9780136156734", "Pearson", "5th Edition", 2009, "English", "State space methods, PID controller tuning, and transient response.", ee, 3);
        addBook("Power Electronics: Circuits, Devices & Applications", "Muhammad H. Rashid", "9780131011403", "Pearson", "4th Edition", 2013, "English", "Thyristors, converters, inverters, and motor drive controllers.", ee, 3);
        addBook("Digital Signal Processing", "John G. Proakis, Dimitris G. Manolakis", "9780131873742", "Pearson", "4th Edition", 2006, "English", "DFT, FFT algorithms, digital filter design, and spectral estimation.", ee, 3);
        addBook("The Art of Electronics", "Paul Horowitz, Winfield Hill", "9780521809269", "Cambridge University Press", "3rd Edition", 2015, "English", "The definitive hands-on manual for circuit designers.", ee, 4);
        addBook("RF Microelectronics", "Behzad Razavi", "9780137138739", "Prentice Hall", "2nd Edition", 2011, "English", "Transceivers, LNA, mixers, oscillators, and power amplifiers.", ee, 2);
        addBook("Electric Machinery Fundamentals", "Stephen J. Chapman", "9780073529547", "McGraw-Hill", "5th Edition", 2011, "English", "Transformers, AC/DC motors, generators, and magnetic circuits.", ee, 3);

        // Category 3: Mechanical Engineering (20 books)
        addBook("Engineering Mechanics: Statics & Dynamics", "Russell C. Hibbeler", "9780133915426", "Pearson", "14th Edition", 2015, "English", "Principles of equilibrium, kinematics, and kinetics for mechanical systems.", me, 4);
        addBook("Mechanics of Materials", "Ferdinand P. Beer, E. Russell Johnston", "9780073398235", "McGraw-Hill", "7th Edition", 2014, "English", "Stress, strain, torsion, bending moments, and beam deflection analysis.", me, 4);
        addBook("Fundamentals of Thermodynamics", "Claus Borgnakke, Richard E. Sonntag", "9781118131992", "Wiley", "8th Edition", 2012, "English", "First and Second laws of thermodynamics, entropy, energy conversion cycles.", me, 3);
        addBook("Fluid Mechanics", "Frank M. White", "9780073398273", "McGraw-Hill", "8th Edition", 2015, "English", "Hydrostatics, Bernoulli equation, Navier-Stokes equations, and boundary layers.", me, 3);
        addBook("Heat and Mass Transfer: Fundamentals and Applications", "Yunus A. Cengel, Afshin J. Ghajar", "9780073398181", "McGraw-Hill", "5th Edition", 2014, "English", "Conduction, convection, radiation heat transfer, and heat exchangers.", me, 3);
        addBook("Shigley's Mechanical Engineering Design", "Richard G. Budynas, Keith J. Nisbett", "9780073398204", "McGraw-Hill", "10th Edition", 2014, "English", "Design of gears, bearings, shafts, fasteners, and mechanical components.", me, 4);
        addBook("Design of Machine Elements", "V.B. Bhandari", "9789339221126", "McGraw-Hill Education", "4th Edition", 2017, "English", "Comprehensive handbook on mechanical design stress calculations.", me, 3);
        addBook("Internal Combustion Engines", "V. Ganesan", "9781259006197", "McGraw-Hill Education", "4th Edition", 2012, "English", "Spark ignition and compression ignition engine design and performance.", me, 3);
        addBook("Manufacturing Engineering and Technology", "Serope Kalpakjian, Steven R. Schmid", "9780133128741", "Pearson", "7th Edition", 2013, "English", "Casting, forming, machining, welding, and additive manufacturing processes.", me, 3);
        addBook("Theory of Machines", "S.S. Rattan", "9789351340164", "McGraw-Hill Education", "4th Edition", 2014, "English", "Kinematic chains, cams, gears, flywheels, governors, and vibrations.", me, 4);
        addBook("Mechanical Vibrations", "Singiresu S. Rao", "9780134361307", "Pearson", "6th Edition", 2016, "English", "Single-degree and multi-degree-of-freedom mechanical vibration systems.", me, 2);
        addBook("Introduction to Robotics: Mechanics and Control", "John J. Craig", "9780201543612", "Pearson", "3rd Edition", 2004, "English", "Forward/inverse kinematics, Jacobians, dynamics, and trajectory generation.", me, 3);
        addBook("Gas Turbines", "V. Ganesan", "9780070681927", "McGraw-Hill", "3rd Edition", 2010, "English", "Principles of jet propulsion, compressors, turbines, and combustion chambers.", me, 2);
        addBook("Refrigeration and Air Conditioning", "C.P. Arora", "9780070083905", "McGraw-Hill", "3rd Edition", 2008, "English", "Psychrometrics, vapor compression cycles, and HVAC system design.", me, 3);
        addBook("Automotive Mechanics", "William H. Crouse, Donald L. Anglin", "9780070634350", "McGraw-Hill", "10th Edition", 2006, "English", "Complete reference on automobile subsystems, transmission, and braking.", me, 3);
        addBook("Materials Science and Engineering: An Introduction", "William D. Callister, David G. Rethwisch", "9781118324578", "Wiley", "9th Edition", 2013, "English", "Atomic structure, phase diagrams, mechanical properties of metals and alloys.", me, 3);
        addBook("Finite Element Analysis: Theory and Application", "Saeed Moaveni", "9780133840803", "Pearson", "4th Edition", 2014, "English", "FEA modeling, element formulations, structural and thermal stress.", me, 3);
        addBook("Mechatronics: Electronic Control Systems in Mechanical Engineering", "W. Bolton", "9780273742869", "Pearson", "5th Edition", 2011, "English", "Sensors, actuators, PLC programming, and system integration.", me, 3);
        addBook("Power Plant Engineering", "P.K. Nag", "9789339204044", "McGraw-Hill Education", "4th Edition", 2014, "English", "Thermal, hydroelectric, nuclear, and renewable energy power generation.", me, 3);
        addBook("Kinematics and Dynamics of Machinery", "Robert L. Norton", "9780073529356", "McGraw-Hill", "5th Edition", 2011, "English", "Linkage synthesis, force analysis, and dynamic balancing of engines.", me, 2);

        // Category 4: Mathematics & Data Science (20 books)
        addBook("Thomas' Calculus", "George B. Thomas, Joel R. Hass", "9780134438986", "Pearson", "14th Edition", 2017, "English", "Multivariable calculus, vector analysis, and differential equations.", math, 4);
        addBook("Advanced Engineering Mathematics", "Erwin Kreyszig", "9780470458365", "Wiley", "10th Edition", 2011, "English", "Fourier analysis, complex variables, linear algebra, and ODEs.", math, 5);
        addBook("Linear Algebra and Its Applications", "Gilbert Strang", "9780030105678", "Cengage Learning", "4th Edition", 2005, "English", "Matrices, vector spaces, eigenvalues, and singular value decomposition.", math, 4);
        addBook("Probability and Statistics for Engineers & Scientists", "Ronald E. Walpole, Raymond H. Myers", "9780321629111", "Pearson", "9th Edition", 2011, "English", "Hypothesis testing, regression, ANOVA, and probability distributions.", math, 3);
        addBook("Introductory Statistics", "Prem S. Mann", "9781119055716", "Wiley", "9th Edition", 2016, "English", "Clear conceptual intro to statistical methods and data analysis.", math, 3);
        addBook("Discrete Mathematics and Its Applications", "Kenneth H. Rosen", "9780073383095", "McGraw-Hill", "7th Edition", 2011, "English", "Graph theory, combinatorics, proof methods, and set theory.", math, 4);
        addBook("Pattern Recognition and Machine Learning", "Christopher M. Bishop", "9780387310732", "Springer", "1st Edition", 2006, "English", "Bayesian inference, kernel methods, graphical models, and neural nets.", math, 3);
        addBook("Hands-On Machine Learning with Scikit-Learn, Keras, & TensorFlow", "Aurelien Geron", "9781492032649", "O'Reilly Media", "2nd Edition", 2019, "English", "Practical ML pipelines, ensemble methods, and deep learning architectures.", math, 4);
        addBook("Numerical Methods for Engineers", "Steven C. Chapra, Raymond P. Canale", "9780073397924", "McGraw-Hill", "7th Edition", 2014, "English", "Root finding, numerical integration, matrix solver algorithms.", math, 3);
        addBook("Convex Optimization", "Stephen Boyd, Lieven Vandenberghe", "9780521833783", "Cambridge University Press", "1st Edition", 2004, "English", "Mathematical optimization, duality theory, interior-point methods.", math, 2);
        addBook("Applied Multivariate Statistical Analysis", "Richard A. Johnson, Dean W. Wichern", "9780131877153", "Pearson", "6th Edition", 2007, "English", "PCA, factor analysis, MANOVA, and discriminant analysis.", math, 2);
        addBook("Introduction to Probability Models", "Sheldon M. Ross", "9780124079489", "Academic Press", "11th Edition", 2014, "English", "Markov chains, Poisson processes, and queuing theory.", math, 3);
        addBook("Real Analysis: Modern Techniques and Their Applications", "Gerald B. Folland", "9780471317166", "Wiley", "2nd Edition", 1999, "English", "Measure theory, Lebesgue integration, and Hilbert spaces.", math, 2);
        addBook("Abstract Algebra", "David S. Dummit, Richard M. Foote", "9780471433347", "Wiley", "3rd Edition", 2003, "English", "Groups, rings, fields, Galois theory, and module theory.", math, 2);
        addBook("Statistical Inference", "George Casella, Roger L. Berger", "9780534243128", "Duxbury Resource Center", "2nd Edition", 2001, "English", "Likelihood estimation, sufficiency, confidence bounds, testing theory.", math, 3);
        addBook("Python for Data Analysis", "Wes McKinney", "9781491957660", "O'Reilly Media", "2nd Edition", 2017, "English", "Data wrangling with Pandas, NumPy, and IPython.", math, 4);
        addBook("An Introduction to Statistical Learning", "Gareth James, Daniela Witten, Trevor Hastie", "9781461471370", "Springer", "1st Edition", 2013, "English", "Accessible intro to statistical learning methods with R.", math, 4);
        addBook("Differential Equations and Linear Algebra", "Stephen W. Goode, Scott A. Annin", "9780321964670", "Pearson", "4th Edition", 2015, "English", "Combined introduction to ODEs and linear systems.", math, 3);
        addBook("Topology", "James Munkres", "9780131816299", "Pearson", "2nd Edition", 2000, "English", "General topology, fundamental group, and covering spaces.", math, 2);
        addBook("Data Science from Scratch", "Joel Grus", "9781492041139", "O'Reilly Media", "2nd Edition", 2019, "English", "First principles implementation of ML algorithms in Python.", math, 3);

        // Category 5: Physics & Chemistry (20 books)
        addBook("University Physics with Modern Physics", "Hugh D. Young, Roger A. Freedman", "9780133969290", "Pearson", "14th Edition", 2015, "English", "The premier introductory calculus-based physics textbook worldwide.", phys, 5);
        addBook("Concepts of Physics (Vol 1 & 2)", "H.C. Verma", "9788177091878", "Bharati Bhawan", "1st Edition", 2017, "English", "Legendary physics textbook for engineering & science foundation.", phys, 6);
        addBook("Principles of Quantum Mechanics", "R. Shankar", "9780306447907", "Plenum Press", "2nd Edition", 1994, "English", "Comprehensive introduction to quantum physics and mathematical foundations.", phys, 3);
        addBook("Introduction to Electrodynamics", "David J. Griffiths", "9780321856562", "Pearson", "4th Edition", 2012, "English", "Electrostatics, magnetostatics, electromagnetic waves, and radiation.", phys, 4);
        addBook("Classical Electrodynamics", "John David Jackson", "9780471309321", "Wiley", "3rd Edition", 1998, "English", "Advanced graduate physics text on electrodynamics and special relativity.", phys, 2);
        addBook("Solid State Physics", "Neil W. Ashcroft, N. David Mermin", "9780030839931", "Cengage Learning", "1st Edition", 1976, "English", "Crystal lattices, phonon dispersion, energy bands, and semiconductor physics.", phys, 3);
        addBook("Organic Chemistry", "Paula Yurkanis Bruice", "9780134042282", "Pearson", "8th Edition", 2016, "English", "Reaction mechanisms, stereochemistry, and synthesis pathways.", phys, 4);
        addBook("Atkins' Physical Chemistry", "Peter Atkins, Julio de Paula", "9780198769866", "Oxford University Press", "11th Edition", 2018, "English", "Thermodynamics, quantum chemistry, chemical kinetics, and spectroscopy.", phys, 3);
        addBook("Concise Inorganic Chemistry", "J.D. Lee", "9780632052936", "Wiley-Blackwell", "5th Edition", 1999, "English", "Chemical bonding, coordination compounds, organometallics.", phys, 3);
        addBook("Engineering Chemistry", "P.C. Jain, Monika Jain", "9788188818143", "Dhanpat Rai Publishing", "16th Edition", 2015, "English", "Water technology, fuels, polymers, corrosion, and metallurgy.", phys, 4);
        addBook("Modern Quantum Mechanics", "J.J. Sakurai, Jim Napolitano", "9780805382914", "Addison-Wesley", "2nd Edition", 2010, "English", "Operator algebra, path integrals, scattering theory, and spin kinematics.", phys, 2);
        addBook("Thermal Physics", "Charles Kittel, Herbert Kroemer", "9780716710882", "W. H. Freeman", "2nd Edition", 1980, "English", "Statistical mechanics, partition functions, and Fermi gases.", phys, 3);
        addBook("Optics", "Eugene Hecht", "9780133977226", "Pearson", "5th Edition", 2016, "English", "Interference, diffraction, polarization, lasers, and wave propagation.", phys, 3);
        addBook("Vogel's Textbook of Quantitative Chemical Analysis", "J. Mendham, R.C. Denney", "9780582226289", "Prentice Hall", "6th Edition", 2000, "English", "Titrimetry, gravimetry, and instrumental chemical analysis methods.", phys, 2);
        addBook("Analytical Chemistry", "Douglas A. Skoog, Donald M. West", "9780534418601", "Cengage Learning", "8th Edition", 2003, "English", "Spectroscopy, chromatography, electrochemistry, and data evaluation.", phys, 3);
        addBook("Feynman Lectures on Physics (Vol 1-3)", "Richard P. Feynman", "9780465023820", "Basic Books", "Millennium Edition", 2011, "English", "The classic lectures covering mechanics, electromagnetism, and quantum.", phys, 4);
        addBook("Introduction to Quantum Mechanics", "David J. Griffiths", "9781107179868", "Cambridge University Press", "3rd Edition", 2018, "English", "Schrodinger equation, perturbation theory, and quantum state vectors.", phys, 3);
        addBook("Classical Mechanics", "Herbert Goldstein", "9780201657029", "Addison-Wesley", "3rd Edition", 2001, "English", "Lagrangian and Hamiltonian formulations, rigid body dynamics.", phys, 2);
        addBook("Organic Chemistry", "Jonathan Clayden, Nick Greeves", "9780199270293", "Oxford University Press", "2nd Edition", 2012, "English", "Mechanism-driven approach to organic synthesis and structure.", phys, 3);
        addBook("Physical Chemistry", "Robert J. Silbey, Robert A. Alberty", "9780471215042", "Wiley", "4th Edition", 2004, "English", "Thermodynamics, statistical mechanics, kinetics, and quantum chemistry.", phys, 3);

        // Category 6: Business & Management (20 books)
        addBook("Principles of Marketing", "Philip Kotler, Gary Armstrong", "9780134492513", "Pearson", "17th Edition", 2017, "English", "The undisputed authority on global marketing strategy and consumer behavior.", biz, 4);
        addBook("Financial Management: Theory & Practice", "Prasanna Chandra", "9789353166687", "McGraw-Hill Education", "10th Edition", 2019, "English", "Capital budgeting, working capital, valuation, and financial analysis.", biz, 4);
        addBook("Organizational Behavior", "Stephen P. Robbins, Timothy A. Judge", "9780134729329", "Pearson", "18th Edition", 2018, "English", "Human dynamics, leadership, motivation, and corporate culture.", biz, 3);
        addBook("Strategic Management: Concepts and Cases", "Fred R. David, Forest R. David", "9780134167848", "Pearson", "16th Edition", 2016, "English", "SWOT analysis, competitive intelligence, and strategic execution.", biz, 3);
        addBook("Human Resource Management", "Gary Dessler", "9780134235455", "Pearson", "15th Edition", 2016, "English", "Recruitment, talent retention, labor laws, and employee evaluation.", biz, 3);
        addBook("Operations Management: Sustainability and Supply Chain", "Jay Heizer, Barry Render", "9780134130422", "Pearson", "12th Edition", 2016, "English", "Forecasting, quality management, lean manufacturing, and logistics.", biz, 3);
        addBook("Business Research Methods", "Donald R. Cooper, Pamela S. Schindler", "9780073521503", "McGraw-Hill", "12th Edition", 2013, "English", "Research design, survey sampling, qualitative analysis, and reporting.", biz, 2);
        addBook("Cost Accounting: A Managerial Emphasis", "Charles T. Horngren, Srikant M. Datar", "9780133428704", "Pearson", "15th Edition", 2014, "English", "Activity-based costing, variance analysis, budgeting, and cost control.", biz, 3);
        addBook("Principles of Corporate Finance", "Richard A. Brealey, Stewart C. Myers", "9781259144387", "McGraw-Hill", "12th Edition", 2016, "English", "NPV, capital structure, dividend policy, and risk management.", biz, 3);
        addBook("Supply Chain Management: Strategy, Planning, and Operation", "Sunil Chopra, Peter Meindl", "9780133800203", "Pearson", "6th Edition", 2015, "English", "Inventory optimization, distribution network design, and sourcing.", biz, 3);
        addBook("Management Information Systems", "Kenneth C. Laudon, Jane P. Laudon", "9780134639710", "Pearson", "15th Edition", 2017, "English", "Enterprise systems, cloud computing, and digital transformation.", biz, 3);
        addBook("The Lean Startup", "Eric Ries", "9780307887894", "Crown Business", "1st Edition", 2011, "English", "MVP development, build-measure-learn loops, and pivot strategies.", biz, 4);
        addBook("Good to Great", "Jim Collins", "9780066620992", "HarperBusiness", "1st Edition", 2001, "English", "Why some companies make the leap and others don't.", biz, 4);
        addBook("Zero to One: Notes on Startups", "Peter Thiel, Blake Masters", "9780804139298", "Crown Business", "1st Edition", 2014, "English", "Building the future by creating innovative monopolies.", biz, 4);
        addBook("Competitive Strategy", "Michael E. Porter", "9780684841489", "Free Press", "1st Edition", 1998, "English", "Porter's Five Forces and generic competitive strategies.", biz, 3);
        addBook("Measure What Matters", "John Doerr", "9780525536222", "Portfolio", "1st Edition", 2018, "English", "How Google, Bono, and the Gates Foundation Rock the World with OKRs.", biz, 3);
        addBook("Blue Ocean Strategy", "W. Chan Kim, Renee Mauborgne", "9781625274496", "Harvard Business Review Press", "Expanded Edition", 2015, "English", "Create uncontested market space and make the competition irrelevant.", biz, 4);
        addBook("Start with Why", "Simon Sinek", "9781591846444", "Portfolio", "Reissue Edition", 2011, "English", "How great leaders inspire everyone to take action.", biz, 4);
        addBook("Built to Last: Successful Habits of Visionary Companies", "Jim Collins, Jerry I. Porras", "9780060516406", "HarperBusiness", "1st Edition", 2002, "English", "Habits of century-old visionary corporate institutions.", biz, 3);
        addBook("Atomic Habits", "James Clear", "9780735211292", "Avery", "1st Edition", 2018, "English", "An easy & proven way to build good habits & break bad ones.", biz, 5);

        // Category 7: Economics & Finance (20 books)
        addBook("Principles of Economics", "N. Gregory Mankiw", "9781305585126", "Cengage Learning", "8th Edition", 2017, "English", "The standard textbook covering both micro and macro economic foundations.", econ, 5);
        addBook("Microeconomic Theory", "Hal R. Varian", "9780393927023", "W. W. Norton & Company", "8th Edition", 2009, "English", "Consumer choice, game theory, general equilibrium, and market failure.", econ, 3);
        addBook("Macroeconomics", "Olivier Blanchard", "9780133780581", "Pearson", "7th Edition", 2016, "English", "IS-LM model, inflation, unemployment, monetary and fiscal policy.", econ, 3);
        addBook("International Economics: Theory and Policy", "Paul Krugman, Maurice Obstfeld", "9780133423648", "Pearson", "10th Edition", 2014, "English", "Trade theory, tariffs, exchange rates, and global financial architecture.", econ, 3);
        addBook("The Economics of Money, Banking and Financial Markets", "Frederic S. Mishkin", "9780133836790", "Pearson", "11th Edition", 2015, "English", "Central banking, Federal Reserve policy, interest rate dynamics.", econ, 3);
        addBook("Econometric Analysis", "William H. Greene", "9780131395381", "Pearson", "7th Edition", 2011, "English", "Time series analysis, instrumental variables, panel data regression.", econ, 2);
        addBook("The Intelligent Investor", "Benjamin Graham", "9780060555665", "Harper Business", "Revised Edition", 2003, "English", "The definitive book on value investing and market wisdom.", econ, 5);
        addBook("Financial Accounting", "Robert Libby, Patricia Libby", "9781259536946", "McGraw-Hill", "9th Edition", 2016, "English", "Balance sheets, income statements, cash flows, and GAAP compliance.", econ, 3);
        addBook("Investment Analysis and Portfolio Management", "Frank K. Reilly, Keith C. Brown", "9780538482387", "Cengage Learning", "10th Edition", 2011, "English", "CAPM, bond pricing, derivative valuation, and portfolio theory.", econ, 3);
        addBook("Development Economics", "Debraj Ray", "9780691017068", "Princeton University Press", "1st Edition", 1998, "English", "Poverty traps, income inequality, agrarian land contracts, and growth.", econ, 2);
        addBook("Public Finance", "Harvey S. Rosen, Ted Gayer", "9780078021688", "McGraw-Hill", "10th Edition", 2013, "English", "Taxation policy, public goods, social security, and welfare economics.", econ, 2);
        addBook("Freakonomics", "Steven D. Levitt, Stephen J. Dubner", "9780060731335", "William Morrow", "1st Edition", 2005, "English", "Rogue economist explores the hidden side of everything.", econ, 4);
        addBook("Thinking, Fast and Slow", "Daniel Kahneman", "9780374533557", "Farrar, Straus and Giroux", "1st Edition", 2011, "English", "Nobel prize winner explains cognitive biases and decision making.", econ, 4);
        addBook("Capital in the Twenty-First Century", "Thomas Piketty", "9780674430006", "Belknap Press", "1st Edition", 2014, "English", "Comprehensive empirical analysis of wealth and income inequality.", econ, 3);
        addBook("The Wealth of Nations", "Adam Smith", "9780553585971", "Bantam Classics", "Reprint Edition", 2003, "English", "The founding text of modern free market economics.", econ, 3);
        addBook("A Random Walk Down Wall Street", "Burton G. Malkiel", "9780393358384", "W. W. Norton & Company", "12th Edition", 2019, "English", "The time-tested strategy for successful investing.", econ, 4);
        addBook("Rich Dad Poor Dad", "Robert T. Kiyosaki", "9781612680194", "Plata Publishing", "20th Anniversary Edition", 2017, "English", "What the rich teach their kids about money that the poor do not.", econ, 5);
        addBook("The Psychology of Money", "Morgan Housel", "9780857197689", "Harriman House", "1st Edition", 2020, "English", "Timeless lessons on wealth, greed, and happiness.", econ, 5);
        addBook("Corporate Finance", "Stephen Ross, Randolph Westerfield", "9781259918940", "McGraw-Hill", "12th Edition", 2018, "English", "Valuation, capital structure, options, and working capital.", econ, 3);
        addBook("Game Theory for Applied Economists", "Robert Gibbons", "9780691003955", "Princeton University Press", "1st Edition", 1992, "English", "Static and dynamic games of complete and incomplete information.", econ, 2);

        // Category 8: Medical & Life Sciences (20 books)
        addBook("Guyton and Hall Textbook of Medical Physiology", "John E. Hall", "9781455770052", "Saunders", "13th Edition", 2015, "English", "The world standard textbook for human cardiovascular and organ physiology.", med, 4);
        addBook("Gray's Anatomy for Students", "Richard Drake, A. Wayne Vogl", "9780702051319", "Churchill Livingstone", "3rd Edition", 2014, "English", "Clinical human anatomy with detailed illustrations.", med, 4);
        addBook("Harrison's Principles of Internal Medicine", "Joseph Loscalzo, Anthony Fauci", "9781259644030", "McGraw-Hill", "20th Edition", 2018, "English", "The essential clinical internal medicine reference for physicians.", med, 3);
        addBook("Robbins & Cotran Pathologic Basis of Disease", "Vinay Kumar, Abul K. Abbas", "9781455726134", "Saunders", "9th Edition", 2014, "English", "Cellular mechanisms of human disease, neoplasia, and organ pathology.", med, 3);
        addBook("Lehninger Principles of Biochemistry", "David L. Nelson, Michael M. Cox", "9781464126116", "W. H. Freeman", "7th Edition", 2017, "English", "Enzyme kinetics, metabolic pathways, DNA replication, and proteins.", med, 4);
        addBook("Molecular Biology of the Cell", "Bruce Alberts, Alexander Johnson", "9780815344322", "Garland Science", "6th Edition", 2014, "English", "Cell structure, signal transduction, gene regulation, and organelle function.", med, 3);
        addBook("Harper's Illustrated Biochemistry", "Victor W. Rodwell, David A. Bender", "9780071825344", "McGraw-Hill", "30th Edition", 2015, "English", "Clinical relevance of bioenergetics, amino acids, and lipids.", med, 3);
        addBook("Essential Microbiology", "Stuart Hogg", "9780470857908", "Wiley", "2nd Edition", 2013, "English", "Bacterial structures, viral replication, fungi, and immunology.", med, 3);
        addBook("Genetics: A Conceptual Approach", "Benjamin A. Pierce", "9781464109461", "W. H. Freeman", "5th Edition", 2013, "English", "Mendelian genetics, chromosome mapping, genomics, and CRISPR.", med, 3);
        addBook("Basic and Clinical Pharmacology", "Bertram G. Katzung, Anthony J. Trevor", "9780071825054", "McGraw-Hill", "13th Edition", 2014, "English", "Drug receptors, pharmacokinetics, antibiotics, and neuropharmacology.", med, 3);
        addBook("Janeway's Immunobiology", "Kenneth Murphy, Casey Weaver", "9780815345053", "Garland Science", "9th Edition", 2016, "English", "Innate and adaptive immune systems, T-cell activation, antibodies.", med, 3);
        addBook("Cell and Molecular Biology: Concepts and Experiments", "Gerald Karp", "9781118206737", "Wiley", "7th Edition", 2013, "English", "Experimental evidence in cellular transport and genetics.", med, 3);
        addBook("Jawetz, Melnick & Adelberg's Medical Microbiology", "Stefan Riedel, Stephen A. Morse", "9781260012026", "McGraw-Hill", "28th Edition", 2019, "English", "Pathogenic bacteria, viruses, parasitology, and diagnostics.", med, 3);
        addBook("Human Anatomy", "Frederic H. Martini, Michael J. Timmons", "9780321883322", "Pearson", "8th Edition", 2014, "English", "Systemic human gross anatomy with regional dissection guides.", med, 3);
        addBook("Plant Physiology and Development", "Lincoln Taiz, Eduardo Zeiger", "9781605352558", "Sinauer Associates", "6th Edition", 2014, "English", "Photosynthesis, plant hormones, growth regulation, and mineral nutrition.", med, 2);
        addBook("Netter's Atlas of Human Anatomy", "Frank H. Netter", "9780323393225", "Elsevier", "7th Edition", 2018, "English", "Masterpiece hand-drawn human anatomy illustrations.", med, 4);
        addBook("Ganong's Review of Medical Physiology", "Kim E. Barrett", "9781260122404", "McGraw-Hill", "26th Edition", 2019, "English", "Concise review of cellular and organ system physiology.", med, 3);
        addBook("Goodman and Gilman's The Pharmacological Basis of Therapeutics", "Laurence Brunton", "9781259584732", "McGraw-Hill", "13th Edition", 2017, "English", "The blue bible of clinical pharmacology.", med, 2);
        addBook("Medical Surgical Nursing", "Donna D. Ignatavicius", "9780323444859", "Elsevier", "9th Edition", 2017, "English", "Patient-centered collaborative care nursing reference.", med, 3);
        addBook("Principles of Neural Science", "Eric R. Kandel, Sarah H. Mack", "9780071390118", "McGraw-Hill", "5th Edition", 2012, "English", "Nobel laureate textbook on brain function and neurobiology.", med, 2);

        // Category 9: Civil & Architecture (20 books)
        addBook("Building Construction", "B.C. Punmia, Ashok Kumar Jain", "9788131804285", "Laxmi Publications", "11th Edition", 2016, "English", "Foundations, brick masonry, concrete works, roofs, and scaffolding.", civil, 4);
        addBook("Architectural Graphic Standards", "Ramsey, Sleeper", "9781118909508", "Wiley", "12th Edition", 2016, "English", "The architect's bible for building dimensions, materials, and detailing.", civil, 3);
        addBook("Principles of Geotechnical Engineering", "Braja M. Das, Khaled Sobhan", "9781305635180", "Cengage Learning", "9th Edition", 2017, "English", "Soil compaction, permeability, shear strength, and slope stability.", civil, 3);
        addBook("Environmental Engineering", "Howard S. Peavy, Donald R. Rowe", "9780071002318", "McGraw-Hill", "1st Edition", 1985, "English", "Water treatment, sewage purification, air pollution, and solid waste.", civil, 3);
        addBook("Town Planning", "S.C. Rangwala", "9789380358680", "Charotar Publishing House", "27th Edition", 2015, "English", "Urban zoning, master planning, traffic management, and housing design.", civil, 3);
        addBook("Concrete Technology: Theory and Practice", "M.S. Shetty", "9788121900034", "S. Chand Publishing", "7th Edition", 2015, "English", "Cement properties, mix design, admixtures, and durability of concrete.", civil, 4);
        addBook("Estimating and Costing in Civil Engineering", "B.N. Dutta", "9788127000348", "UBS Publishers", "28th Edition", 2016, "English", "Rate analysis, quantity surveying, specifications, and tenders.", civil, 4);
        addBook("Structural Analysis", "Russell C. Hibbeler", "9780133942842", "Pearson", "9th Edition", 2014, "English", "Trusses, cables, influence lines, stiffness matrix methods.", civil, 3);
        addBook("Reinforced Concrete Design", "S. Unnikrishna Pillai, Devdas Menon", "9780070141100", "McGraw-Hill", "3rd Edition", 2009, "English", "Limit state design of beams, columns, slabs, and footings.", civil, 4);
        addBook("Structural Dynamics: Theory and Computation", "Mario Paz, William Leigh", "9781402076671", "Springer", "5th Edition", 2004, "English", "Earthquake engineering, response spectrum analysis, and dynamic loads.", civil, 2);
        addBook("Urban Planning and Design", "Arthur B. Gallion, Simon Eisner", "9780442211912", "Van Nostrand Reinhold", "5th Edition", 1986, "English", "History of urban development, transportation networks, and green belts.", civil, 2);
        addBook("Building Materials", "S.K. Duggal", "9789386070401", "New Age International", "4th Edition", 2017, "English", "Bricks, stones, timber, steel, glass, and composite construction materials.", civil, 3);
        addBook("Water Resources Engineering", "Larry W. Mays", "9780470574164", "Wiley", "2nd Edition", 2010, "English", "Hydrology, dam hydraulics, open channel flow, and stormwater management.", civil, 3);
        addBook("Construction Planning, Equipment, and Methods", "Robert L. Peurifoy, Clifford J. Schexnayder", "9780073401126", "McGraw-Hill", "8th Edition", 2010, "English", "Heavy equipment selection, excavation, productivity, and cost control.", civil, 3);
        addBook("Landscape Architecture: A Manual of Environmental Planning", "John Ormsbee Simonds", "9780071461207", "McGraw-Hill", "4th Edition", 2006, "English", "Site planning, terrain adaptation, vegetation design, and spatial flow.", civil, 2);
        addBook("Surveying (Vol 1 & 2)", "B.C. Punmia, Ashok Kumar Jain", "9788170088837", "Laxmi Publications", "16th Edition", 2005, "English", "Levelling, triangulation, total stations, and GPS surveying.", civil, 4);
        addBook("Design of Steel Structures", "N. Subramanian", "9780198068815", "Oxford University Press", "2nd Edition", 2011, "English", "Tension members, compression members, bolted and welded joints.", civil, 3);
        addBook("Highway Engineering", "S.K. Khanna, C.E.G. Justo", "9788185240800", "Nem Chand & Bros", "10th Edition", 2014, "English", "Pavement design, geometric alignment, and traffic safety engineering.", civil, 3);
        addBook("Foundation Engineering", "Ralph B. Peck, Walter E. Hanson", "9780471675853", "Wiley", "2nd Edition", 1974, "English", "Shallow footings, deep pile foundations, and retaining wall design.", civil, 2);
        addBook("A Visual Dictionary of Architecture", "Francis D.K. Ching", "9781118745007", "Wiley", "2nd Edition", 2011, "English", "Comprehensive visual definitions of architectural components.", civil, 3);

        // Category 10: Literature & Humanities (20 books)
        addBook("To Kill a Mockingbird", "Harper Lee", "9780061120084", "Harper Perennial", "50th Anniversary Edition", 2006, "English", "Pulitzer Prize-winning classic novel of racial justice and human compassion.", hum, 4);
        addBook("1984", "George Orwell", "9780451524935", "Signet Classic", "Reissue Edition", 1950, "English", "Dystopian masterpiece on totalitarianism, surveillance, and Big Brother.", hum, 5);
        addBook("Pride and Prejudice", "Jane Austen", "9780141439518", "Penguin Classics", "Clean Edition", 2002, "English", "Classic romantic novel exploring societal manners and marriage.", hum, 3);
        addBook("The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", "Scribner", "Reprint Edition", 2004, "English", "The Jazz Age tale of ambition, illusion, and the American Dream.", hum, 4);
        addBook("Hamlet", "William Shakespeare", "9780743477123", "Simon & Schuster", "Folger Shakespeare Edition", 2003, "English", "Tragic play of revenge, morality, and human existence.", hum, 4);
        addBook("Crime and Punishment", "Fyodor Dostoevsky", "9780143058441", "Penguin Classics", "Translated Edition", 2003, "English", "Psychological drama of guilt, redemption, and morality in St. Petersburg.", hum, 3);
        addBook("One Hundred Years of Solitude", "Gabriel Garcia Marquez", "9780060883287", "Harper Perennial", "Reprint Edition", 2006, "English", "Magical realism epic chronicling seven generations of the Buendia family.", hum, 3);
        addBook("Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "9780062316097", "Harper", "1st Edition", 2015, "English", "Provocative narrative of human evolution, cognitive revolutions, and culture.", hum, 5);
        addBook("The Republic", "Plato", "9780140455113", "Penguin Classics", "Translated Edition", 2007, "English", "Socratic dialogue on justice, philosopher kings, and the ideal state.", hum, 3);
        addBook("A Brief History of Time", "Stephen Hawking", "9780553380163", "Bantam", "10th Anniversary Edition", 1998, "English", "Exploration of black holes, the Big Bang, and quantum cosmology for general readers.", hum, 4);
        addBook("The Art of War", "Sun Tzu", "9781590302255", "Shambhala", "Translated Edition", 2005, "English", "Ancient Chinese military strategy applicable to leadership and conflict.", hum, 4);
        addBook("Thinking in Systems: A Primer", "Donella H. Meadows", "9781603580557", "Chelsea Green Publishing", "1st Edition", 2008, "English", "Systemic thinking, feedback loops, and solving complex societal problems.", hum, 3);
        addBook("The Structure of Scientific Revolutions", "Thomas S. Kuhn", "9780226458120", "University of Chicago Press", "4th Edition", 2012, "English", "Landmark work introducing paradigm shifts in scientific discovery.", hum, 3);
        addBook("Critical Thinking: Tools for Taking Charge of Your Learning", "Richard Paul, Linda Elder", "9780132180917", "Pearson", "3rd Edition", 2011, "English", "Frameworks for logical reasoning, bias detection, and analytical thought.", hum, 3);
        addBook("Man's Search for Meaning", "Viktor E. Frankl", "9780807014295", "Beacon Press", "Reprint Edition", 2006, "English", "Psychiatrist's memoir of surviving Holocaust camps and finding purpose.", hum, 4);
        addBook("The Odyssey", "Homer", "9780140268867", "Penguin Classics", "Robert Fagles Translation", 1996, "English", "Epic ancient Greek poem of Odysseus' ten-year journey home.", hum, 3);
        addBook("The Catcher in the Rye", "J.D. Salinger", "9780316769488", "Little, Brown and Company", "Reissue Edition", 1991, "English", "Classic novel of teenage alienation and loss of innocence.", hum, 4);
        addBook("Brave New World", "Aldous Huxley", "9780060850524", "Harper Perennial", "Reprint Edition", 2006, "English", "Dystopian vision of a technologically controlled society.", hum, 4);
        addBook("Meditations", "Marcus Aurelius", "9780812968255", "Modern Library", "Gregory Hays Translation", 2002, "English", "Stoic philosophy and personal reflections of the Roman Emperor.", hum, 5);
        addBook("The Prince", "Niccolo Machiavelli", "9780140449150", "Penguin Classics", "Translated Edition", 2003, "English", "Classic treatise on political power, statecraft, and pragmatism.", hum, 3);

        // Category 11: Indian Epics, Mythology & Classics
        addBook("The Ramayana of Valmiki", "Sage Valmiki", "9780143064320", "Penguin Classics", "Critical Edition", 2008, "Sanskrit", "The timeless ancient Indian epic detailing the life, virtue, and journey of Lord Rama.", epics, 5);
        addBook("The Mahabharata", "Sage Vyasa", "9780143100133", "Penguin Classics", "Unabridged Edition", 2010, "Sanskrit", "The grand epic of Kurukshetra, duty, dharma, and royal dynasty.", epics, 5);
        addBook("The Bhagavad Gita", "Sage Vyasa / Eknath Easwaran", "9781586380199", "Nilgiri Press", "2nd Edition", 2007, "Sanskrit", "The sacred 700-verse dialogue on karma, yoga, dharma, and self-realization.", epics, 6);
        addBook("Panchatantra: Ancient Fables of India", "Vishnu Sharma", "9788172230807", "HarperCollins", "Classic Edition", 1993, "Sanskrit", "Interwoven animal fables teaching political wisdom, strategy, and human behavior.", epics, 4);
        addBook("Ponniyin Selvan (The Son of Ponni)", "Kalki Krishnamurthy", "9789353335502", "Pustaka Digital", "Illustrated Edition", 1954, "Tamil", "The legendary historical fiction epic of the Chola Dynasty.", epics, 5);
        addBook("Shiva Trilogy: The Immortals of Meluha", "Amish Tripathi", "9789380658742", "Westland", "1st Edition", 2010, "Hindi", "Mythological reimagining of Shiva as a Tibetan warrior in the Indus valley.", epics, 5);
        addBook("Chanakya Neeti: Ancient Indian Strategy", "Chanakya (Kautilya)", "9788128822506", "Diamond Books", "Revised Edition", 2011, "Sanskrit", "Aphorisms on statecraft, governance, ethics, and personal leadership.", epics, 4);
        addBook("Godan (The Gift of a Cow)", "Munshi Premchand", "9788121600811", "Rajkamal Prakashan", "Classic Edition", 1936, "Hindi", "The masterpiece Hindi realistic novel depicting rural Indian peasantry.", epics, 4);
        addBook("Gitanjali (Song Offerings)", "Rabindranath Tagore", "9788171672325", "Rupa Publications", "Nobel Edition", 1912, "Bengali", "Nobel Prize-winning collection of spiritual, devotional Bengali poems.", epics, 4);
        addBook("Madhushala (House of Wine)", "Harivansh Rai Bachchan", "9788121612715", "Rajpal & Sons", "Anniversary Edition", 1935, "Hindi", "Famous neo-romantic 136-quatrain Hindi poem on life's metaphors.", epics, 4);
        addBook("Malgudi Days", "R.K. Narayan", "9780140055016", "Penguin Books", "Reprint Edition", 1982, "English", "Enchanting short stories set in the fictional South Indian town of Malgudi.", epics, 4);
        addBook("Train to Pakistan", "Khushwant Singh", "9780143065884", "Penguin India", "Anniversary Edition", 1956, "Punjabi", "Harrowing novel set during the Partition of India in 1947.", epics, 3);
        addBook("Autobiography of a Yogi", "Paramahansa Yogananda", "9788189535513", "Yogoda Satsanga Society", "Original Edition", 1946, "Bengali", "Spiritual classic recounting meetings with saints, yogis, and Kriya Yoga.", epics, 4);
        addBook("Rashmirathi", "Ramdhari Singh Dinkar", "9788128800047", "Lokbharti Prakashan", "Classic Edition", 1952, "Hindi", "Epic Hindi poem celebrating the tragic life, honor, and valor of Karna.", epics, 4);
        addBook("Yayati", "V.S. Khandekar", "9788171850433", "Popular Prakashan", "Jnanpith Edition", 1959, "Marathi", "Jnanpith Award-winning Marathi mythological novel on human desire.", epics, 3);

        // Category 12: World Fiction & Global Classics
        addBook("The Alchemist", "Paulo Coelho", "9780062315007", "HarperOne", "25th Anniversary Edition", 1988, "Spanish", "Fable of Santiago's quest for treasure and listening to one's heart.", fiction, 5);
        addBook("The Little Prince (Le Petit Prince)", "Antoine de Saint-Exupery", "9780156012195", "Mariner Books", "Translation Edition", 1943, "French", "Philosophical tale of love, loneliness, friendship, and human nature.", fiction, 4);
        addBook("War and Peace", "Leo Tolstoy", "9780140447934", "Penguin Classics", "Pevear & Volokhonsky Translation", 1869, "Russian", "Monumental epic of Russian aristocratic families during the Napoleonic wars.", fiction, 3);
        addBook("Don Quixote", "Miguel de Cervantes", "9780060934347", "Harper Perennial", "Grossman Translation", 1605, "Spanish", "The founding novel of Western literature following the idealistic knight.", fiction, 3);
        addBook("Les Miserables", "Victor Hugo", "9780451419439", "Signet Classic", "Unabridged Edition", 1862, "French", "Epic French story of Jean Valjean, redemption, justice, and revolution.", fiction, 3);
        addBook("Metamorphosis (Die Verwandlung)", "Franz Kafka", "9780553213690", "Bantam Classics", "Translation Edition", 1915, "German", "Surreal novella of Gregor Samsa transforming into a giant insect.", fiction, 4);
        addBook("Faust", "Johann Wolfgang von Goethe", "9780140449013", "Penguin Classics", "Greenfield Translation", 1808, "German", "Tragic play of Faust's pact with the demon Mephistopheles for knowledge.", fiction, 3);
        addBook("The Count of Monte Cristo", "Alexandre Dumas", "9780140449266", "Penguin Classics", "Buss Translation", 1844, "French", "Ultimate tale of wrongful imprisonment, escape, and calculated vengeance.", fiction, 4);

        System.out.println(">>> SUCCESSFULLY SEEDED ALL EPICS, WORLD FICTION & COLLEGE BOOKS!");

        seedCourseReserves();
    }

    private void seedCourseReserves() {
        if (courseReserveRepository.count() > 0) return;

        bookRepository.findByIsbnAndIsDeletedFalse("9780262033848").ifPresent(book -> {
            courseReserveRepository.save(com.example.demo.model.CourseReserve.builder()
                    .courseCode("CS 301")
                    .courseName("Data Structures & Algorithms")
                    .department("Computer Science & IT")
                    .instructor("Prof. Alan Turing")
                    .semester("Fall 2026")
                    .book(book)
                    .requirementType("REQUIRED")
                    .build());
        });

        bookRepository.findByIsbnAndIsDeletedFalse("9780132350884").ifPresent(book -> {
            courseReserveRepository.save(com.example.demo.model.CourseReserve.builder()
                    .courseCode("CS 301")
                    .courseName("Data Structures & Algorithms")
                    .department("Computer Science & IT")
                    .instructor("Prof. Alan Turing")
                    .semester("Fall 2026")
                    .book(book)
                    .requirementType("RECOMMENDED")
                    .build());
        });

        bookRepository.findByIsbnAndIsDeletedFalse("9781118131992").ifPresent(book -> {
            courseReserveRepository.save(com.example.demo.model.CourseReserve.builder()
                    .courseCode("ME 201")
                    .courseName("Thermodynamics & Heat Transfer")
                    .department("Mechanical Engineering")
                    .instructor("Dr. Nikola Tesla")
                    .semester("Fall 2026")
                    .book(book)
                    .requirementType("REQUIRED")
                    .build());
        });

        bookRepository.findByIsbnAndIsDeletedFalse("9780132774208").ifPresent(book -> {
            courseReserveRepository.save(com.example.demo.model.CourseReserve.builder()
                    .courseCode("EE 102")
                    .courseName("Digital Circuits & Signals")
                    .department("Electrical & Electronics")
                    .instructor("Prof. James Maxwell")
                    .semester("Fall 2026")
                    .book(book)
                    .requirementType("REQUIRED")
                    .build());
        });

        bookRepository.findByIsbnAndIsDeletedFalse("9780321629111").ifPresent(book -> {
            courseReserveRepository.save(com.example.demo.model.CourseReserve.builder()
                    .courseCode("MATH 402")
                    .courseName("Applied Statistics & Probability")
                    .department("Mathematics & Data Science")
                    .instructor("Dr. Carl Gauss")
                    .semester("Fall 2026")
                    .book(book)
                    .requirementType("REQUIRED")
                    .build());
        });

        System.out.println(">>> SEEDED SAMPLE COURSE RESERVES!");
    }

    private void seed1000Books() {
        long currentCount = bookRepository.count();
        if (currentCount >= 1000) return;

        System.out.println(">>> Expanding library collection to 1,000+ books... Current count: " + currentCount);

        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) return;

        String[] prefixes = {"Advanced ", "Principles of ", "Fundamentals of ", "Modern ", "Applied ", "Handbook of ", "Essentials of ", "Introduction to ", "Mastering ", "Comprehensive "};
        
        String[][] subjectsPerCategory = {
            {"Cloud Native Architecture", "Kubernetes Microservices", "Machine Learning Operations", "Compiler Optimization", "Distributed Database Engines", "Quantum Computing Algorithms", "Cybersecurity Threat Hunting", "Full-Stack Web Engineering", "Rust Systems Programming", "Deep Neural Networks"},
            {"VLSI Circuit Engineering", "Embedded System Interfaces", "Microcontroller Architecture", "Digital Signal Processing", "Power Electronics & Smart Grids", "Semiconductor Device Physics", "Control Systems Engineering", "RF Microwave Circuits", "Optical Communications", "Robotic Sensor Fusion"},
            {"Applied Thermodynamics", "Fluid Dynamics & Turbomachinery", "Finite Element Analysis", "Kinematics of Advanced Machinery", "Computational Fluid Dynamics", "Automotive Powertrains", "Industrial Robotics & Mechatronics", "Materials Metallurgy", "Heat and Mass Transfer", "Robotic Manipulators"},
            {"Multivariable Vector Calculus", "Applied Matrix Linear Algebra", "Stochastic Probability Processes", "Numerical Methods for Engineers", "Bayesian Data Analysis", "Graph Theory & Combinatorics", "Nonlinear Differential Equations", "Statistical Learning Theory", "Algebraic Topology", "Convex Optimization"},
            {"Quantum Field Theory", "Classical Hamiltonian Mechanics", "Electrodynamics & Relativity", "Organic Synthesis Reactions", "Physical Chemistry Kinetics", "Nuclear & Particle Physics", "Solid State Condensed Matter", "Laser Spectroscopy", "Analytical Chemistry Instrumentation", "Astrophysics & Cosmology"},
            {"Strategic Corporate Leadership", "Global Supply Chain Logistics", "Digital Marketing Analytics", "Agile Product Management", "Organizational Behavior", "Venture Capital & Startups", "Corporate Governance Ethics", "Brand Equity Strategy", "Operations Research", "Financial Risk Governance"},
            {"Macroeconomic Policy Analysis", "Financial Econometrics", "Corporate Valuation Models", "Options & Financial Derivatives", "Behavioral Economics & Decisions", "International Trade Agreements", "Asset Pricing Models", "Fintech & Blockchain Economics", "Public Fiscal Policy", "Banking Risk Assessment"},
            {"Clinical Human Neuroanatomy", "Medical Pathophysiology", "Pharmacology & Drug Action", "Cellular Molecular Biology", "Human Genomics & Genetics", "Immunology & Disease", "Neuroscience & Cognitive Systems", "Clinical Microbiology", "Epidemiology & Biostatistics", "Metabolic Biochemistry"},
            {"Structural Reinforced Concrete", "Geotechnical Foundation Engineering", "Transportation Network Design", "Environmental Hydrology", "Building Information Modeling", "Geospatial GIS Mapping", "Urban Infrastructure Planning", "Seismic Earthquake Engineering", "Construction Project Dynamics", "Architectural Acoustics"},
            {"World History & Civilizations", "Formal Logic & Critical Thought", "Ethics & Moral Philosophy", "Comparative Literature Studies", "Cultural Anthropology", "Sociology of Media", "Political Theory & Democracy", "Art History & Visual Culture", "Philosophy of Mind", "Environmental Philosophy"}
        };

        String[] publishers = {"MIT Press", "O'Reilly Media", "Cambridge University Press", "Oxford University Press", "Pearson", "Springer Nature", "McGraw-Hill", "Wiley", "Academic Press", "Harvard Business Publishing"};
        String[] authors = {"Dr. Arthur Pendelton", "Prof. Eleanor Vance", "Dr. Marcus Sterling", "Prof. Sophia Chen", "Dr. Vikram Patel", "Prof. Hannah Wright", "Dr. Liam O'Connor", "Prof. Maya Lin", "Dr. David Miller", "Prof. Sarah Jenkins"};

        long target = 1000 - currentCount;
        int seeded = 0;

        for (int i = 1; i <= target; i++) {
            int catIdx = i % categories.size();
            Category cat = categories.get(catIdx);
            
            String prefix = prefixes[i % prefixes.length];
            String[] subList = subjectsPerCategory[catIdx % subjectsPerCategory.length];
            String subject = subList[i % subList.length];
            
            int volNum = (i / 10) + 1;
            String title = prefix + subject + " (Vol. " + volNum + ")";
            String author = authors[i % authors.length] + " & Co.";
            String isbn = String.format("978938%07d", i + (int)currentCount);
            String publisher = publishers[i % publishers.length];
            String edition = ((i % 4) + 1) + "th Edition";
            int year = 2012 + (i % 14);
            String desc = "Comprehensive academic textbook on " + subject + " covering core theoretical foundations, practical case studies, and advanced problem-solving methodologies for university students and researchers.";
            
            addBook(title, author, isbn, publisher, edition, year, "English", desc, cat, 3);
            seeded++;
        }

        System.out.println(">>> SUCCESSFULLY SEEDED " + seeded + " ADDITIONAL BOOKS! TOTAL BOOKS NOW: " + bookRepository.count());
    }

    private Category getOrCreateCategory(String name, String desc) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(Category.builder().name(name).description(desc).build()));
    }

    private static final String[] UNIQUE_BOOK_COVERS = {
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80"
    };

    private String getCategoryCoverUrl(String title) {
        int idx = Math.abs((title != null ? title.hashCode() : 1) * 17) % UNIQUE_BOOK_COVERS.length;
        return UNIQUE_BOOK_COVERS[idx];
    }

    private String toAmazonIsbn10Url(String isbn13) {
        String clean = isbn13.replaceAll("[^0-9X]", "");
        if (clean.length() == 10) {
            return "https://images-na.ssl-images-amazon.com/images/P/" + clean + ".01._SX350_SY475_SCLZZZZZZZ_.jpg";
        }
        if (clean.length() == 13 && clean.startsWith("978")) {
            String nine = clean.substring(3, 12);
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += (nine.charAt(i) - '0') * (10 - i);
            }
            int rem = (11 - (sum % 11)) % 11;
            char check = rem == 10 ? 'X' : (char)('0' + rem);
            return "https://images-na.ssl-images-amazon.com/images/P/" + nine + check + ".01._SX350_SY475_SCLZZZZZZZ_.jpg";
        }
        return null;
    }

    private String getRealCoverForKnownBook(String isbn) {
        if (isbn == null) return null;
        switch (isbn) {
            case "9780143064320": return "https://images-na.ssl-images-amazon.com/images/P/0143064320.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Ramayana
            case "9780143100133": return "https://images-na.ssl-images-amazon.com/images/P/0143100130.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Mahabharata
            case "9781586380199": return "https://images-na.ssl-images-amazon.com/images/P/1586380195.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Bhagavad Gita
            case "9788172230807": return "https://images-na.ssl-images-amazon.com/images/P/8172230800.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Panchatantra
            case "9789353335502": return "https://images-na.ssl-images-amazon.com/images/P/9353335500.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Ponniyin Selvan
            case "9789380658742": return "https://images-na.ssl-images-amazon.com/images/P/9380658745.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Immortals of Meluha
            case "9788128822506": return "https://images-na.ssl-images-amazon.com/images/P/8128822500.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Chanakya Neeti
            case "9788121600811": return "https://images-na.ssl-images-amazon.com/images/P/8121600810.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Godan
            case "9788171672325": return "https://images-na.ssl-images-amazon.com/images/P/8171672320.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Gitanjali
            case "9788121612715": return "https://images-na.ssl-images-amazon.com/images/P/8121612710.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Madhushala
            case "9780140055016": return "https://images-na.ssl-images-amazon.com/images/P/0140055010.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Malgudi Days
            case "9780062315007": return "https://images-na.ssl-images-amazon.com/images/P/0062315005.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // The Alchemist
            case "9780062316097": return "https://images-na.ssl-images-amazon.com/images/P/0062316095.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Sapiens
            case "9780735211292": return "https://images-na.ssl-images-amazon.com/images/P/0735211299.01._SX350_SY475_SCLZZZZZZZ_.jpg"; // Atomic Habits
            default: return null;
        }
    }

    private void addBook(String title, String author, String isbn, String publisher, String edition, Integer year, String language, String desc, Category category, int copies) {
        if (bookRepository.existsByIsbnAndIsDeletedFalse(isbn)) return;

        // Cover Image URL resolution
        String knownCover = getRealCoverForKnownBook(isbn);
        String cleanIsbn = isbn.replaceAll("[^0-9A-Za-z]", "");
        String amazonUrl = toAmazonIsbn10Url(cleanIsbn);
        
        String coverUrl = knownCover != null ? knownCover : ((amazonUrl != null && !cleanIsbn.startsWith("978938")) ? amazonUrl : getCategoryCoverUrl(title));

        Book book = bookRepository.save(Book.builder()
                .title(title)
                .author(author)
                .isbn(isbn)
                .publisher(publisher)
                .edition(edition)
                .publicationYear(year)
                .language(language)
                .description(desc)
                .coverImageUrl(coverUrl)
                .category(category)
                .build());

        String suffix = cleanIsbn.substring(Math.max(0, cleanIsbn.length() - 4));
        for (int i = 1; i <= copies; i++) {
            String barcode = "LIB-" + book.getId() + "-" + suffix + "-" + String.format("%03d", i);
            if (!bookCopyRepository.existsByBarcode(barcode)) {
                bookCopyRepository.save(BookCopy.builder()
                        .book(book)
                        .barcode(barcode)
                        .status(CopyStatus.AVAILABLE)
                        .rackLocation("Rack " + category.getName().substring(0, Math.min(3, category.getName().length())).toUpperCase() + "-" + (i % 5 + 1))
                        .build());
            }
        }
    }
}
