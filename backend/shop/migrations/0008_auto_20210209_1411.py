# Generated by Django 3.1.4 on 2021-02-09 13:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0007_auto_20210207_1315'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='itemimage',
            options={'ordering': ['-is_main']},
        ),
        migrations.RemoveField(
            model_name='itemimage',
            name='ordering',
        ),
        migrations.AddField(
            model_name='itemimage',
            name='is_main',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='itemimage',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='images', to='shop.item'),
        ),
    ]