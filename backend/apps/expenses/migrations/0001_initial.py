import django.conf
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(django.conf.settings.AUTH_USER_MODEL),
        ("groups", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Expense",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=160)),
                ("description", models.TextField(blank=True)),
                ("total_amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("split_type", models.CharField(choices=[("equal", "Equal"), ("custom", "Custom")], default="equal", max_length=20)),
                ("expense_date", models.DateField()),
                ("category", models.CharField(blank=True, max_length=80)),
                ("receipt_image", models.ImageField(blank=True, null=True, upload_to="expense_receipts/")),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="created_expenses", to=django.conf.settings.AUTH_USER_MODEL)),
                ("group", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="expenses", to="groups.expensegroup")),
                ("paid_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="paid_expenses", to=django.conf.settings.AUTH_USER_MODEL)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="ExpenseSplit",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("amount_owed", models.DecimalField(decimal_places=2, max_digits=12)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("marked_paid", "Marked paid"), ("confirmed", "Confirmed")], default="pending", max_length=20)),
                ("expense", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="splits", to="expenses.expense")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="expense_splits", to=django.conf.settings.AUTH_USER_MODEL)),
            ],
            options={
                "unique_together": {("expense", "user")},
            },
        ),
    ]
