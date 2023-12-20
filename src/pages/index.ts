// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

const pageInfoMap = {};
// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const name = key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1');
  const mod = (modules as Recordable)[key].default || {};
  pageInfoMap[name] = mod;
});

export function getPageInfo(name: string, instance) {
  return pageInfoMap[name] || pageInfoMap['bank-account'];
}
