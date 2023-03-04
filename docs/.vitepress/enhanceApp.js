export default ({router}) => {
    /**
     * 路由切换事件处理
     */
    router.beforeEach((to, from, next) => {
        // console.log("切换路由", to.fullPath, from.fullPath);
        //触发百度的pv统计
        if (typeof _hmt != "undefined") {
            if (to.path) {
                let path = '/doc' + to.fullPath
                _hmt.push(["_trackPageview", path]);
                console.log("上报百度统计:", path);
            }
        }
        // continue
        next();
    });
};
