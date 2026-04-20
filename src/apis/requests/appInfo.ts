import appInfo from '@/apis/urls/appInfo';
import req from '@/apis/index';

export default {
  getAppInfo: (params: object) => req.get(appInfo.appInfoUrl, params),
  getUserInfo: (params: object) => req.get(appInfo.userInfo, params),
};
