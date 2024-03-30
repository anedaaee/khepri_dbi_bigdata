# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

from scrapy.pipelines.files import FilesPipeline


class UsPipeline(object):
    def process_item(self, item, spider):
        return item


class StockPipeline(FilesPipeline):

    def file_path(self, request, response=None, info=None):

        return "us_stocks/{id}.csv".format(
                   id=request.url.split("/")[6].lower()
               )


class IndexPipeline(FilesPipeline):

    def file_path(self, request, response=None, info=None):

        return "us_indexes/{id}.csv".format(
                   id=request.url.split("/")[6].lower()
               )
