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
            name="ExpenseGroup",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120)),
                ("description", models.TextField(blank=True)),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="created_expense_groups", to=django.conf.settings.AUTH_USER_MODEL)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="GroupMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("role", models.CharField(choices=[("owner", "Owner"), ("member", "Member")], default="member", max_length=20)),
                ("group", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="member_links", to="groups.expensegroup")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="group_memberships", to=django.conf.settings.AUTH_USER_MODEL)),
            ],
            options={
                "unique_together": {("group", "user")},
            },
        ),
        migrations.AddField(
            model_name="expensegroup",
            name="members",
            field=models.ManyToManyField(related_name="expense_groups", through="groups.GroupMember", to=django.conf.settings.AUTH_USER_MODEL),
        ),
    ]
