-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- 主机： localhost:3306
-- 生成日期： 2020-05-22 11:45:40
-- 服务器版本： 5.7.26
-- PHP 版本： 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- 数据库： `x-chat`
--

-- --------------------------------------------------------

--
-- 表的结构 `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL COMMENT '群ID',
  `room_id` char(100) NOT NULL DEFAULT '' COMMENT '房间ID',
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '群名称',
  `create_user_id` int(11) NOT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `groups`
--

INSERT INTO `groups` (`id`, `room_id`, `name`, `create_user_id`, `create_time`) VALUES
(1, '092d4610-9b37-11ea-932d-ed38dd4680a1', 'Test0521001', 1, '2020-05-21 07:45:26'),
(2, '32069460-9b37-11ea-820b-5173954490e9', 'Test0521002', 1, '2020-05-21 07:46:35'),
(3, 'd56c3740-9b41-11ea-adfd-bd37a4845102', 'Test0521003', 1, '2020-05-21 09:02:44'),
(4, '11417230-9b42-11ea-824a-b999665d2d46', 'Test0521004', 1, '2020-05-21 09:04:24'),
(5, '3fad72e0-9b42-11ea-878c-439886efb1c7', 'Test0521005', 1, '2020-05-21 09:05:42');

-- --------------------------------------------------------

--
-- 表的结构 `msg_group`
--

CREATE TABLE `msg_group` (
  `id` int(11) NOT NULL COMMENT '群消息ID',
  `user_id` int(11) NOT NULL COMMENT '群成员ID',
  `group_id` int(11) NOT NULL COMMENT '群ID',
  `content` text NOT NULL COMMENT '消息内容',
  `content_type` char(100) NOT NULL COMMENT '内容类型',
  `create_time` datetime NOT NULL COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `msg_group`
--

INSERT INTO `msg_group` (`id`, `user_id`, `group_id`, `content`, `content_type`, `create_time`) VALUES
(1, 1, 1, '12313', 'text', '2020-05-22 02:19:39'),
(2, 1, 1, 'dddd', 'text', '2020-05-22 02:26:11'),
(3, 2, 1, 'cccc', 'text', '2020-05-22 02:56:37'),
(4, 2, 1, 'fff\n', 'text', '2020-05-22 02:56:54'),
(5, 2, 1, 'hehe\n', 'text', '2020-05-22 02:57:48');

-- --------------------------------------------------------

--
-- 表的结构 `msg_private`
--

CREATE TABLE `msg_private` (
  `id` int(11) NOT NULL COMMENT '私信ID',
  `from_user_id` int(11) NOT NULL COMMENT '发送者ID',
  `to_user_id` int(11) NOT NULL COMMENT '接收者ID',
  `content` text COMMENT '消息内容',
  `create_time` datetime NOT NULL COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL COMMENT '用户ID',
  `account` varchar(32) NOT NULL COMMENT '账号',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `type` tinyint(1) NOT NULL COMMENT '类型：0管理员 1普通用户',
  `status` tinyint(1) NOT NULL COMMENT '状态：0停用 1启用',
  `socket_id` char(100) NOT NULL COMMENT 'socket会话ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户信息表';

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`id`, `account`, `password`, `type`, `status`, `socket_id`, `create_time`, `update_time`) VALUES
(1, 'root', 'ED5wLgc3Mnw=', 0, 1, '', '2017-07-20 09:18:04', '2017-11-16 09:26:58'),
(2, 'admin', 'ED5wLgc3Mnw=', 0, 1, '', '2017-07-20 09:18:04', '2017-11-16 09:26:58');

-- --------------------------------------------------------

--
-- 表的结构 `user_group_relation`
--

CREATE TABLE `user_group_relation` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL COMMENT '群ID',
  `user_id` int(11) NOT NULL COMMENT '群成员ID'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user_group_relation`
--

INSERT INTO `user_group_relation` (`id`, `group_id`, `user_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 5, 1);

--
-- 转储表的索引
--

--
-- 表的索引 `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `msg_group`
--
ALTER TABLE `msg_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `to_group` (`group_id`);

--
-- 表的索引 `msg_private`
--
ALTER TABLE `msg_private`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_user` (`from_user_id`),
  ADD KEY `to_user` (`to_user_id`);

--
-- 表的索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `user_group_relation`
--
ALTER TABLE `user_group_relation`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群ID', AUTO_INCREMENT=6;

--
-- 使用表AUTO_INCREMENT `msg_group`
--
ALTER TABLE `msg_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群消息ID', AUTO_INCREMENT=6;

--
-- 使用表AUTO_INCREMENT `msg_private`
--
ALTER TABLE `msg_private`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '私信ID';

--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID', AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `user_group_relation`
--
ALTER TABLE `user_group_relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
