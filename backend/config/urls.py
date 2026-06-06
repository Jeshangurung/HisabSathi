from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.views import CurrentUserView, LogoutView, PaymentProfileViewSet, RegisterView, UserProfileViewSet
from apps.common.views import DashboardSummaryView
from apps.expenses.views import ExpenseSplitViewSet, ExpenseViewSet
from apps.groups.views import ExpenseGroupViewSet, GroupMemberViewSet
from apps.loans.views import LoanViewSet
from apps.reminders.views import ReminderViewSet
from apps.settlements.views import SettlementViewSet


router = DefaultRouter()
router.register("profiles", UserProfileViewSet, basename="profiles")
router.register("payment-profiles", PaymentProfileViewSet, basename="payment-profiles")
router.register("groups", ExpenseGroupViewSet, basename="groups")
router.register("group-members", GroupMemberViewSet, basename="group-members")
router.register("expenses", ExpenseViewSet, basename="expenses")
router.register("expense-splits", ExpenseSplitViewSet, basename="expense-splits")
router.register("settlements", SettlementViewSet, basename="settlements")
router.register("loans", LoanViewSet, basename="loans")
router.register("reminders", ReminderViewSet, basename="reminders")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/me/", CurrentUserView.as_view(), name="current_user"),
    path("api/dashboard/", DashboardSummaryView.as_view(), name="dashboard_summary"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
