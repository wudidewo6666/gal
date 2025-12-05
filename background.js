// background.js - 点击表格行更换页面背景功能

document.addEventListener('DOMContentLoaded', function() {
    // 定义游戏背景图片映射
    const gameBackgrounds = {
        '魔女的夜宴': '魔女的夜宴/游戏.jpg',
        '金辉恋曲四重奏': '金辉恋曲四重奏/游戏.jpg',
        '初雪樱': '初雪樱/9e399bbceb9f27f5c4438548fb796c6e_720.jpg',
        '苍彼': '苍之彼方的四重奏/游戏.jpg'
    };

    // 获取所有的表格行
    const rows = document.querySelectorAll('tbody tr');
    
    // 为每一行添加点击事件监听器
    rows.forEach(row => {
        row.addEventListener('click', function() {
            
            // 获取游戏名称（第二个td中的文本）
            const gameName = this.querySelector('td:nth-child(2)').textContent;
            
            // 如果该游戏有对应的背景图片
            if (gameBackgrounds[gameName]) {
                // 更改页面背景
                document.body.style.backgroundImage = `url('${gameBackgrounds[gameName]}')`;
                
                // 控制背景图片尺寸的几种方式（根据需要选择其中一种）：
                // 1. 覆盖整个背景区域（当前使用的方式）
                document.body.style.backgroundSize = 'cover';
                
                // 2. 完整显示图片（适合查看完整图片）
                 //document.body.style.backgroundSize = 'contain';
                
                // 3. 拉伸图片以填满整个背景
                // document.body.style.backgroundSize = '100% 100%';
                
                // 4. 设置固定的宽度和高度（例如800px宽，600px高）
                 //document.body.style.backgroundSize = '1600px 800px';
                
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundRepeat = 'no-repeat';
            }
            
            // 为当前选中的行添加高亮样式
            rows.forEach(r => r.style.backgroundColor = '');
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        });
    });

});