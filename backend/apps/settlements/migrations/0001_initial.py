import django.conf
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(django.conf.settings.AUTH_USER_MODEL),
        ("expenses", "0001_initial"),
        ("groups", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Settlement",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("marked_paid", "Marked paid"), ("confirmed", "Confirmed"), ("rejected", "Rejected")], default="pending", max_length=20)),
                ("payment_method", models.CharField(blank=True, max_length=80)),
                ("proof_image", models.ImageField(blank=True, null=True, upload_to="settlement_proofs/")),
                ("transaction_note", models.TextField(blank=True)),
                ("marked_paid_at", models.DateTimeField(blank=True, null=True)),
                ("confirmed_at", models.DateTimeField(blank=True, null=True)),
                ("expense", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="settlements", to="expenses.expense")),
                ("from_user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="settlements_to_pay", to=django.conf.settings.AUTH_USER_MODEL)),
                ("group", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="settlements", to="groups.expensegroup")),
                ("to_user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="settlements_to_receive", to=django.conf.settings.AUTH_USER_MODEL)),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
