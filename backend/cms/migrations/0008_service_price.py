from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0007_video_item_section'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='price',
            field=models.CharField(blank=True, max_length=80, verbose_name='Ціна'),
        ),
    ]
