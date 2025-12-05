// gallery.js - 图片画廊和音乐播放功能

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建音频元素
    const audio = document.createElement('audio');
    audio.id = 'bgMusic';
    audio.style.display = 'none';
    document.body.appendChild(audio);
    
    // 当前播放状态和信息
    let currentPlaying = {
        element: null,
        isPlaying: false,
        gameName: ''
    };
    
    // 游戏和音乐文件的映射关系
    const gameMusicMap = {
        '魔宴': './魔女的夜宴/米仓千寻 - 恋せよ乙女! (恋爱吧少女情结)_H.ogg',
        '金恋': './金辉恋曲四重奏/佐咲纱花 - Golden Mission_H.ogg',
        '初雪樱': './初雪樱/fripSide - HesitationSnow_L.ogg',
        '苍彼': './苍之彼方的四重奏/川田麻美 - Wings of Courage -空を超えて- (勇气之翼-越过天际-).ogg',
    };
    
    // 播放音乐函数
    function playMusic(src, imgElement, gameName) {
        console.log('尝试播放音乐:', src);
        // 检查文件是否存在
        fetch(src)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('音乐文件存在:', src);
                audio.src = src;
                
                // 尝试播放音频
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // 自动播放成功
                        console.log(gameName + ' 的音乐开始播放');
                        
                        // 更新当前播放状态
                        currentPlaying.element = imgElement;
                        currentPlaying.isPlaying = true;
                        currentPlaying.gameName = gameName;
                        
                        // 应用正在播放的样式
                        imgElement.style.transform = 'scale(1.1)';
                        imgElement.style.border = '3px solid gold';
                        imgElement.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
                    }).catch(error => {
                        // 自动播放失败（浏览器阻止等）
                        console.log('音乐播放失败:', error);
                        alert('音乐播放失败: ' + error.message);
                    });
                }
            })
            .catch(error => {
                console.error('音乐文件不存在或无法访问:', src, error);
                alert('音乐文件不存在或无法访问: ' + src + '\n错误信息: ' + error.message);
            });
    }
    
    // 暂停音乐函数
    function pauseMusic() {
        audio.pause();
        
        // 恢复之前的样式
        if (currentPlaying.element) {
            currentPlaying.element.style.transform = '';
            currentPlaying.element.style.border = '';
            currentPlaying.element.style.boxShadow = '';
        }
        
        // 重置播放状态
        currentPlaying.isPlaying = false;
        currentPlaying.element = null;
        currentPlaying.gameName = '';
    }
    
    // 为所有图片添加点击事件监听器
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function() {
            // 获取图片的alt属性作为游戏名称
            const gameName = this.alt;
            console.log('点击图片，游戏名称:', gameName);
            
            // 根据游戏名称设置对应的音频文件
            if (gameMusicMap[gameName]) {
                const musicSrc = gameMusicMap[gameName];
                console.log('找到音乐文件映射:', musicSrc);
                
                // 如果当前正在播放同一首音乐，则暂停
                if (currentPlaying.isPlaying && currentPlaying.gameName === gameName) {
                    console.log('暂停当前播放的音乐');
                    pauseMusic();
                } else {
                    // 如果正在播放其他音乐，先暂停
                    if (currentPlaying.isPlaying) {
                        console.log('停止当前播放的音乐，播放新的音乐');
                        pauseMusic();
                    }
                    
                    // 播放新的音乐
                    playMusic(musicSrc, this, gameName);
                }
            } else {
                // 默认音频文件
                console.log('找不到 ' + gameName + ' 对应的音乐文件');
                alert('找不到 ' + gameName + ' 对应的音乐文件');
            }
        });
    });
});