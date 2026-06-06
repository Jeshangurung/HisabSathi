import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import AddExpensePage from "../features/expenses/pages/AddExpensePage.jsx";
import ExpenseDetailPage from "../features/expenses/pages/ExpenseDetailPage.jsx";
import CreateGroupPage from "../features/groups/pages/CreateGroupPage.jsx";
import GroupDetailPage from "../features/groups/pages/GroupDetailPage.jsx";
import GroupsPage from "../features/groups/pages/GroupsPage.jsx";
import AddLoanPage from "../features/loans/pages/AddLoanPage.jsx";
import LoanTrackerPage from "../features/loans/pages/LoanTrackerPage.jsx";
import LandingPage from "../features/marketing/pages/LandingPage.jsx";
import NotFoundPage from "../features/misc/pages/NotFoundPage.jsx";
import PaymentProfilePage from "../features/profile/pages/PaymentProfilePage.jsx";
import ProfilePage from "../features/profile/pages/ProfilePage.jsx";
import RemindersPage from "../features/reminders/pages/RemindersPage.jsx";
import SettlementPage from "../features/settlements/pages/SettlementPage.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ProtectedRoute />}>
        <Route element={<Navigate replace to="/dashboard" />} path="/app" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<GroupsPage />} path="/groups" />
        <Route element={<CreateGroupPage />} path="/groups/new" />
        <Route element={<GroupDetailPage />} path="/groups/:groupId" />
        <Route element={<AddExpensePage />} path="/expenses/new" />
        <Route element={<ExpenseDetailPage />} path="/expenses/:expenseId" />
        <Route element={<SettlementPage />} path="/settlements" />
        <Route element={<LoanTrackerPage />} path="/loans" />
        <Route element={<AddLoanPage />} path="/loans/new" />
        <Route element={<RemindersPage />} path="/reminders" />
        <Route element={<ProfilePage />} path="/profile" />
        <Route element={<PaymentProfilePage />} path="/profile/payment" />
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
