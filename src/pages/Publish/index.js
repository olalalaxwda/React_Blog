import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { useStore } from '@/store'
import { useState, useRef, useEffect } from 'react'
import { http } from '@/utils'
  
const { Option } = Select
  
const Publish = () => {
    const navigate = useNavigate()
    const {channelStore} = useStore()
    const [fileList,setFileList]=useState([])
    //声明一个暂存仓库，上传图片时将所有图片存储到ref中
    const fileListRef = useRef([])
    //上传图片成功的回调函数
    const onUploadChange = info =>{
        const fileList = info.fileList.map(file=>{
            if(file.response){
                return{
                    url:file.response.data.url
                }
            }
            return file
        })
        setFileList(fileList)
        fileListRef.current = fileList
    }
    //记录选择的图片上传数量
    const [imgCount, setImgCount] = useState(1)
    const changeType = e => {
        const count = e.target.value
        setImgCount(count)
        if(count === 1){
            const firstImg = fileListRef.current[0]
            setFileList(!firstImg?[]:[firstImg])
        }else if(count === 3){
            setFileList(fileListRef.current)
        }
    }
    //数据的二次处理，把收集到的数据转化成后端需要的形式
    const onFinish = async(values)=>{
        const {channel_id,content,title,type}=values
        console.log(fileList)
        const params = {channel_id, 
                        content, 
                        title, 
                        type,
                        cover:{
                            type:type,
                            images:fileList.map(item=>item.url)
                        }}
        if(articleId){
            await http.put(`/mp/articles/${articleId}?draft=false`,params)
        }else{
            await http.post('/mp/articles?draft=false', params)
        }
        navigate('/article')
        message.success(`${articleId?'更新成功':'发布成功'}`)
    }
    //判断跳转到Publish页面时是否带有参数，带有的话是编辑已存在的博客，不带有的话是新建的博客
    const [params] = useSearchParams()
    const articleId = params.get('id')
    //判断文章id是否存在，如果存在就根据id获取文章详情数据
    const form = useRef(null)
    useEffect(()=>{
        async function getArticle(){
            const res = await http.get(`/mp/articles/${articleId}`)
            const data = res.data.data
            //表单数据回填 实例方法
            form.current.setFieldsValue({...data,type:data.cover.type})
            //格式化封面图片数据
            const formatImageList = data.cover.images.map(url=>({url}))
            setFileList(formatImageList)
            setImgCount(data.cover.type)
            fileListRef.current = formatImageList
        }
        if(articleId){
            getArticle()
        }
    },[articleId])
    return (
      <div className="publish">
        <Card
          title={
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {articleId?'修改文章':'发布文章'}
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认
                initialValues={{ content:'' }}
                onFinish={onFinish}
                ref={form}
            >
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入文章标题' }]}
                >
                <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                </Form.Item>
                <Form.Item
                    label="频道"
                    name="channel_id"
                    rules={[{ required: true, message: '请选择文章频道' }]}
                >
                    <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                        {channelStore.channelList.map(
                            (channel)=>(
                                <Option 
                                    value={channel.id} key={channel.id}>{channel.name}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item label="封面">
                    <Form.Item name="type">
                        <Radio.Group onChange={changeType}>
                            <Radio value={1}>单图</Radio>
                            <Radio value={3}>三图</Radio>
                            <Radio value={0}>无图</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {imgCount > 0 &&(
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList
                            action="http://geek.itheima.net/v1_0/upload"
                            fileList={ fileList }
                            onChange={ onUploadChange }
                            maxCount={ imgCount }
                            multiple={ imgCount > 1 }
                        >
                            <div style={{ marginTop: 8 }}>
                                <PlusOutlined />
                            </div>
                    </Upload>
                    )}
                    
                </Form.Item>
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '请输入文章内容' }]}
                >
                    <ReactQuill
                        className="publish-quill"
                        theme="snow"
                        placeholder="请输入文章内容"
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                <Space>
                    <Button size="large" type="primary" htmlType="submit">
                        {articleId?'修改文章':'发布文章'}
                    </Button>
                </Space>
                </Form.Item>
            </Form>
        </Card>
      </div>
    )
}
  
export default Publish