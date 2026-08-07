# 📚 LibraryVerse – Enterprise Full-Stack Digital Library System

LibraryVerse is a modern, high-performance digital library management system built with **Spring Boot 3** and **Next.js 16**. It manages over **10,300+ real published titles** across 18 academic disciplines with real-time catalog search, physical barcode tracking, course reserves, student reviews, and study space reservations.

---

## ✨ Key Features

- ⚡ **High-Performance Pagination**: Server-side pagination (`size=36`) delivering **<100ms instant response times** across 10,300+ books.
- 🎨 **Dynamic Glassmorphic Design**: 5 customizable themes (*Obsidian Dark, Apple iOS Glass, Pure Porcelain, Cyber Emerald, Neon Violet*).
- 🏷️ **Physical Barcode & Rack Tracking**: Automated `LIB-{ID}-{ISBN}-{INDEX}` copy generation and physical shelf location mapping.
- 🔐 **Spring Security 6 & JWT Auth**: Role-Based Access Control (**RBAC**) for Students and System Administrators.
- 📖 **Course Reserves & Student Reviews**: Dedicated course reserve materials and interactive 5-star student review module.
- 🏢 **Study Room Reservations**: Real-time room booking and space scheduling system.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, TanStack React Query, Tailwind CSS, Lucide Icons |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Spring Security 6, JWT, H2 / PostgreSQL |
| **Deployment** | Vercel (Frontend), Railway (Backend API) |

---

## 🌐 Live Application Links

- **Frontend App**: [https://library-universe.vercel.app](https://library-universe.vercel.app)
- **Catalog Page**: [https://library-universe.vercel.app/catalog](https://library-universe.vercel.app/catalog)
- **Backend API**: [https://library-management-system-production-88c1.up.railway.app](https://library-management-system-production-88c1.up.railway.app)
