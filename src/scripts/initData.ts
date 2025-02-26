import {sign, parse} from '@telegram-apps/init-data-node';

const data = sign(
  {
    user: {
      added_to_attachment_menu: false,
      allows_write_to_pm: false,
      first_name: 'user-first-name',
      id: 422,
      is_bot: true,
      is_premium: false,
      language_code: 'en',
      last_name: 'user-last-name',
      photo_url: 'user-photo',
      username: 'user-username',
    },
  },
  '7668450099:AAEKau2UpSQbsD3n-tSBvI40b2_d7bfqa-Y',
  new Date()
);

console.log(data);

const parsedData = parse(data);
console.log(parsedData);
