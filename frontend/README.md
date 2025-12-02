# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




bloggy/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── commentController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authentication.js
│   │   ├── errorHandler.js
│   │   ├── multer.js
│   │   └── validation.js
│   ├── models/
│   │   ├── commentModel.js
│   │   ├── postModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── commentRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ActionIcon.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   ├── PostCard.jsx
    │   │   └── [styles].css
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── DiscoverPage.jsx
    │   │   ├── SinglePostPage.jsx
    │   │   ├── CreatePostPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── VisitorProfilePage.jsx
    │   │   ├── LoginSignupPage.jsx
    │   │   └── ContactUsPage.jsx
    │   ├── utils/
    │   │   └── APIBaseUrl.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── main.css
    ├── index.html
    ├── package.json
    └── vite.config.js