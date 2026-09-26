from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_rename_before_after_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactcard',
            name='value',
            field=models.CharField(blank=True, max_length=255, verbose_name='Значення'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Email'),
        ),
    ]
