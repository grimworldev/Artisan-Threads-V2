Local Market AI — Multi-Vendor E-Commerce Boilerplate

A modern full-stack boilerplate built with **Laravel**, **React**, and **Inertia.js**, designed to empower local vendors and small businesses to showcase, manage, and sell their products. 

It includes an **LLM-driven validation engine** that checks uploaded product images and descriptions to ensure listing alignment, prevent misleading content, and maintain quality control across the marketplace.

---

## ✨ Key Features

* **🏪 Vendor Storefronts & Dashboard:** Dedicated spaces for small business owners to manage inventory, update listings, and showcase products.
* **🤖 AI Product Alignment Check:** Automated LLM verification comparing product descriptions against uploaded media/details to ensure listings match reality before publishing.
* **⚡ Seamless SPA Experience:** Monolithic development simplicity with a modern single-page app feel, powered by Inertia.js.
* **👥 Role-Based Access Control (RBAC):** Built-in user roles for Platform Admins, Vendors, and Shoppers.
* **📱 Responsive Design:** Out-of-the-box UI designed for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | [Laravel 13](https://laravel.com/) |
| **Frontend** | [React 19](https://react.dev/) |
| **Routing / Glue** | [Inertia.js 3](https://inertiajs.com/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **AI / LLM** | OpenAI API / Gemini API integration |
| **Database** | MySQL |

---

## 📁 Project Structure

```text
├── app/
│   ├── Http/Controllers/    # Inertia response controllers
│   └── Services/            # LLM Verification logic & prompt building
├── resources/
│   └── js/
│       ├── Components/      # Reusable React components
│       ├── Pages/           # Inertia React page views
│       └── Layouts/         # Application layouts (Admin, Vendor, Customer)
└── routes/                  # Laravel web & API routes
