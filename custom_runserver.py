from django.core.management.commands.runserver import Command as RunserverCommand
from django.core.servers.basehttp import WSGIServer

class CustomWSGIServer(WSGIServer):
    timeout = 10  # 设置超时时间为 10 秒

class Command(RunserverCommand):
    def get_handler(self, *args, **options):
        handler = super().get_handler(*args, **options)
        handler.request_timeout = 10  # 限制超时 10 秒
        return handler

    def inner_run(self, *args, **options):
        self.stdout.write("Running with a 10s timeout...")
        self.server_cls = CustomWSGIServer  # 使用自定义服务器
        super().inner_run(*args, **options)
