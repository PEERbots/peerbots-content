import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "./components/RootLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import MyContentPage from "./pages/my/MyContentPage.tsx";
import MyListingsPage from "./pages/my/MyListingsPage.tsx";
import MyPurchasesPage from "./pages/my/MyPurchasesPage.tsx";
import TagPage from "./pages/tag/TagPage.tsx";
import ContentPage from "./pages/content/ContentPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import SearchResults from "./pages/SearchResultsPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />} errorElement={<ErrorPage />}>
          <Route index element={<HomePage />} path="/" />
          <Route path="search" element={<SearchResults />} />

          <Route path="my">
            <Route path="content" element={<MyContentPage />} />
            <Route path="listings" element={<MyListingsPage />} />
            <Route path="purchases" element={<MyPurchasesPage />} />
          </Route>

          <Route path="tag/:tagId" element={<TagPage />} />
          <Route path="content/:contentId" element={<ContentPage />} />
          <Route element={<ProfilePage />} path="u/:username" />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
