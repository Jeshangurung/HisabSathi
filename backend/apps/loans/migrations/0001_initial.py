import django.conf
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(django.conf.settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Loan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("reason", models.TextField(blank=True)),
                ("due_date", models.DateField(blank=True, null=True)),
                ("proof_image", models.ImageField(blank=True, null=True, upload_to="loan_proofs/")),
                ("status", models.CharField(choices=[("active", "Active"), ("marked_paid", "Marked paid"), ("paid", "Paid"), ("cancelled", "Cancelled")], default="active", max_length=20)),
                ("paid_at", models.DateTimeField(blank=True, null=True)),
                ("borrower", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="loans_taken", to=django.conf.settings.AUTH_USER_MODEL)),
                ("lender", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="loans_given", to=django.conf.settings.AUTH_USER_MODEL)),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
