import NewsPublish from "../../../components/publish-manage/NewsPublish.jsx";
import usePublish from "../../../components/publish-manage/usePublish.jsx";
import {Button} from "antd";

export default function Sunset() {

    // 使用自定义 hooks 请求数据
    // 3 已下线
    const {dataSource, handleDelete} = usePublish(3);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleDelete(id)}>
                删除
            </Button>}></NewsPublish>
        </div>
    )
}
