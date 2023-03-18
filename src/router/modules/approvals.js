import layout from '@/layout'
export default {
    path: '/approvvals',//路径
    name: 'approvvals',
    component: layout, //至于此处为什么是layout，我理解是因为员工页面也需要在layout的布局（navbar，sidebar），
    // 并在他的二级路由里面展示，并且这是动态路由，不能写在静态路由的children里
    children: [{
        path: '',//如果二级路由的path里面社么都不写的情况下，会展示在layout的二级里，表示该路由为当前二级路由的默认路由
        component: () => import('@/views/approvals'),
        meta: {
            title: '审理' //这里是后续循环时左侧导航栏的名称
            , icon: 'tree-table'
        }
    }]
}