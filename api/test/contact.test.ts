import { test } from 'node:test'
import assert from 'node:assert/strict'
import { contactText } from '../src/mail.ts'

test('contactText skips empty optional fields', () => {
  assert.equal(contactText({ firstName: 'Asha', email: 'a@x.in', message: 'Which module suits me?' }),
    'New contact message from Asha\nEmail: a@x.in\n\nWhich module suits me?')
  assert.match(contactText({ firstName: 'A', lastName: 'B', email: 'a@x.in', phone: '99', subject: 'FICO', message: 'hello there' }), /from A B\nEmail: a@x.in\nPhone: 99\nSubject: FICO\n\nhello/)
})
