from django.db import connection, transaction
#请注意添加表名
class Update_ID():
    def __init__(self,data_excel):
        self.data_excel = data_excel
        self.data_excel_name = None
        self.get_table_name()
        self.disable_foreign_keys()
        self.reorder_ids(self.data_excel)
        self.enable_foreign_keys()
    def get_table_name(self):
        model_name = self.data_excel.__name__.lower()
        # print(model_name)
        self.data_excel_name = model_name
    def disable_foreign_keys(self):
        with connection.cursor() as cursor:
            cursor.execute('SET FOREIGN_KEY_CHECKS=0;')

    def enable_foreign_keys(self):
        with connection.cursor() as cursor:
            cursor.execute('SET FOREIGN_KEY_CHECKS=1;')
    # ###数据库里面的表名称要加应用名，例app01_assetlist
    def reorder_ids(self,data_excel):
        with transaction.atomic():
            assets = data_excel.objects.all().order_by('id')
            new_id = 1
            
            for asset in assets:
                with connection.cursor() as cursor:
                    cursor.execute("UPDATE main_app_{}  SET id = %s WHERE id = %s".format(self.data_excel_name), [new_id, asset.id])
                new_id += 1
    # def reorder_ids(self,data_excel):
    #     with transaction.atomic():
    #         assets = data_excel.objects.all().order_by('id')
    #         new_id = 1
            
    #         for asset in assets:
    #             asset.id = new_id
    #             try:
    #                 asset.save(force_update=True)  # 使用 force_update 避免插入操作
    #             except Exception as e:
    #                 print(f"Error updating asset with old ID {asset.id}: {e}")
    #             new_id += 1