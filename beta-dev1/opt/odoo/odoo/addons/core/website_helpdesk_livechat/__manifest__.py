# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Website IM Livechat Helpdesk',
    'category': 'Helpdesk',
    'sequence': 58,
    'summary': 'Ticketing, Support, Livechat',
    'depends': [
        'helpdesk',
        'website_livechat',
    ],
    'description': """
Website IM Livechat integration for the helpdesk module
====================================================

Features:

    - Have a team-related livechat channel to answer your customer's questions.
    - Create new tickets with ease using commands in the channel.

    """,
    'data': [
        'views/helpdesk_view.xml',
    ],
    'auto_install': True,
}
