import { Layout } from "@/components/Layout";
import { FlashcardsPage } from "@/pages/FlashcardsPage";
import { VocabularyListPage } from "@/pages/VocabularyListPage";
import { WordDetailPage } from "@/pages/WordDetailPage";
import { WritingPracticePage } from "@/pages/WritingPracticePage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: VocabularyListPage,
});

const wordDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/word/$id",
  component: WordDetailPage,
});

const flashcardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flashcards",
  component: FlashcardsPage,
});

const writingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/writing",
  component: WritingPracticePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  wordDetailRoute,
  flashcardsRoute,
  writingRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
