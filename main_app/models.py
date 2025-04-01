from django.db import models

# Create your models here.
class switch_datalist(models.Model):
    device_name = (
        (1,"隔离开关"),

    )
    device_type = models.SmallIntegerField(verbose_name="设备类型", choices=device_name, default=1)

    currentA = models.SmallIntegerField(verbose_name="开关A相电流")
    currentB = models.SmallIntegerField(verbose_name="开关B相电流")
    currentC =  models.SmallIntegerField(verbose_name="开关C相电流")
    angle =  models.SmallIntegerField(verbose_name="开关转动角度")
    torque =  models.SmallIntegerField(verbose_name="开关主轴扭矩")
    add_time = models.DateTimeField(verbose_name="录入时间",max_length=32)

class Userlist(models.Model):
    user_name = models.CharField(verbose_name="用户名",max_length=32)
    user_phone = models.CharField(verbose_name="手机号码",max_length=32)
    user_mail = models.CharField(verbose_name="注册邮箱",max_length=32)
    user_password = models.CharField(verbose_name="密码",max_length=32)
    last_pwd_changed = models.DateTimeField(verbose_name="密码修改时间", null=True, blank=True)

class Sys_log(models.Model):
    event_name = (
        (1,"隔离开关运行数据添加"),
        (2,"隔离开关运行数据修改"),
        (3,"隔离开关运行数据删除"),
        (4,"用户信息修改"),
        (5,"用户账号删除"),
        (6,"用户密码重置"),
    )
    event_type = models.SmallIntegerField(verbose_name="事件类型", choices=event_name, default=1)
    user_name = models.CharField(verbose_name="用户名",max_length=32)
    user_phone = models.CharField(verbose_name="手机号码",max_length=32)
    record_time = models.DateTimeField(verbose_name="录入时间",max_length=32)




