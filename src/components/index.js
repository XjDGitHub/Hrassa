// 组件全局注册的，任意地方使用的方法
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ThemePicker from './ThemePicker'


export default {
    install(Vue) {
        //  注册全局的通用栏组件对象
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('ImageUpload', ImageUpload)
        Vue.component('ThemePicker', ThemePicker)
        // Vue.component('screenfull', screenfull)
    }
}