from django.utils.safestring import mark_safe

######自定义分页组件########
    #1.首先根据自己的情况去筛选自己的数据:queryset
    #2.网页的request请求对象
    #3.page_param是在url中获取的参数
    #4.page_size是每页显示的条数
    #5.page_displayNum是显示当前页的前五页和后五页
class Pagination(object):
    def __init__(self, request, queryset, page_param='page', page_size = 10, page_displayNum = 5,):
        pageNum_value = request.GET.get(page_param,'1')
        if pageNum_value.isdecimal():
            pageNum_value =int(pageNum_value)
        else:
            pageNum_value = 1
        self.pageNum_value = pageNum_value
        self.page_size = page_size
        self.data_start = (pageNum_value-1) * page_size
        self.data_end = pageNum_value * page_size
        ###计算总页数###
        self.page_queryset = queryset[self.data_start:self.data_end]
        ###计算总页数###
        total_count = queryset.count()
        total_page_count,div = divmod(total_count,page_size)
        if div:
            total_page_count +=1
        self.total_page_count = total_page_count
        self.page_start = pageNum_value - page_displayNum
        self.page_end = pageNum_value + page_displayNum

        if self.page_start<1:
            self.page_start = 1
        if self.page_end>total_page_count+1:
            self.page_end = total_page_count

        # 检查是否有更多内容
        self.has_more = pageNum_value <= total_page_count

    def html(self):
        page_str_list = []  ###页码列表###
        ###上一页实现###
        if self.pageNum_value-1>0:
            last_ele = '<li><a href="?page={}" aria-label="Previous"><span aria-hidden="true">«</span></a></li>'.format(self.pageNum_value-1)
        else:
            last_ele = '<li><a href="?page={}" aria-label="Previous"><span aria-hidden="true">«</span></a></li>'.format(self.pageNum_value)
        page_str_list.append(last_ele)
        ###中间页限制实现###
        for i in range(self.page_start,self.page_end+1):
            if i==self.pageNum_value:
                ele = '<li class="active"><a href="?page={}">{}</a></li>'.format(i,i)
            else:
                ele = '<li><a href="?page={}">{}</a></li>'.format(i,i)
            page_str_list.append(ele)
        if self.pageNum_value+1>self.total_page_count:
            next_ele = '<li><a href="?page={}" aria-label="Previous"><span aria-hidden="true">»</span></a></li>'.format(self.pageNum_value)
        else:
            next_ele = '<li><a href="?page={}" aria-label="Previous"><span aria-hidden="true">»</span></a></li>'.format(self.pageNum_value+1)
        page_str_list.append(next_ele)
        page_string = mark_safe(''.join(page_str_list))
        ###按搜索内容字典寻找数据并返回####
         
        return page_string, not self.has_more