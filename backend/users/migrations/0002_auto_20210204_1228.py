# Generated by Django 3.1.4 on 2021-02-04 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shippingaddress',
            name='number',
            field=models.CharField(max_length=10),
        ),
    ]
