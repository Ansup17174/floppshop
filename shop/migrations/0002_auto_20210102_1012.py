# Generated by Django 3.1.4 on 2021-01-02 09:12

from django.db import migrations, models
import shop.models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemimage',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to=shop.models.get_upload_path),
        ),
    ]