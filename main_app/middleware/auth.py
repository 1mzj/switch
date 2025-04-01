from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import HttpResponse,redirect

class LoginMiddleware(MiddlewareMixin):
    def process_request(self, request):
        #排除登陆界面

        if request.path_info in ['/login/', '/register/','/create_code/']:
            return

        #读取对当前用户的session信息

        info_dict = request.session.get('info')

        if info_dict:
            return 
        
        return redirect('/login/')
