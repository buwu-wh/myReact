import appUrl from '@/apis/config';
const baseUrl = appUrl.getBaseUrl();
export default {
  appInfoUrl: `${baseUrl}mocks/global.json`,
  userInfo: `${baseUrl}mocks/userInfo.json`,
};
