# -*- coding: utf-8 -*-

from odoo import fields, models, api, exceptions

class hr_employee(models.Model):
    _inherit = 'hr.employee'

    @api.model
    def compute_default_product(self):
        # try:
        #     service = self.env.ref('product.product_product_consultant')
        #     if service and service.id:
        #         return service
        # except ValueError:
        #     pass
        return self.env.ref('hr_timesheet_invoice.product_product_consultant', False)

    @api.model
    def compute_default_journal(self):
        return self.env.ref('hr_timesheet_invoice.timesheet_journal', False)

    product_id = fields.Many2one('product.product', 'Product', default=compute_default_product)
    journal_id = fields.Many2one('account.journal', 'Analytic Journal', domain=[('type', '=', 'service')], default=compute_default_journal)