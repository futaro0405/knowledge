# frozen_string_literal: true

# ランダム文字列を取得
# 平仮名と常用漢字
def self.rand_jp_str(length = 20)
  char = 'あいうえおかきくけこさしすせそたちつてとはひふへほはひふへほやゆよつわあいうえおかきくけこさしすせそたちつてとはひふへほはひふへほやゆよつわ亜哀挨愛曖悪握圧扱宛嵐安案暗以衣'.chars
  Array.new(length) { char[rand(1..char.size)] }.join
end

# アルファベット
def self.rand_en_str(length = 5)
  ('a'..'z').to_a.sample(rand(1..length)).join
end

User.destroy_all
Group.destroy_all

USER_COUNT = 10
POST_COUNT = 100
user_ids = []
post_ids = []

USER_COUNT.times do |n|
  count = n + 1
  user = User.new(
    name: "ユーザ#{count}#{rand_en_str(8)}",
    user_name: "#{count}#{rand_en_str(8)}",
    email: "example#{count}@example.com",
    password: "#{'a' * count}111111",
    birthdate: "#{rand(1900..2010)}-#{rand(1..12)}-#{rand(1..20)}",
    phone: '111122223333',
    introduction: rand(2).zero? ? "自己紹介文です#{rand_jp_str(100)}" : '',
    place: rand(2).zero? ? "東京都#{rand_jp_str(15)}" : '',
    website: rand(2).zero? ? "google.com/#{rand_en_str(8)}" : ''
  )
  user.skip_confirmation!
  user.save!
  user_ids << user.id
end

user_ids.each do |user_id|
  other_ids = user_ids.reject { |id| id == user_id }.sample(rand(1...USER_COUNT - 4))

  other_ids.each do |other_id|
    member_ids = [user_id, other_id]
    existing_group = Group.search_existing_group(user_id:, other_id:)
    if existing_group
      group = existing_group
    else
      group = Group.create!
      member_ids.each { |member_id| GroupMember.create!(user_id: member_id, group_id: group.id) }
    end
    rand(1..5).times do |n|
      Message.create!(
        user_id: member_ids.sample,
        group_id: group.id,
        content: (existing_group ? '既存部屋です。' : '') + "テストコメント#{n}です。\nテストコメント#{n}です。\nテストコメント#{n}です。"
      )
    end
  end
end

POST_COUNT.times do |n|
  post = Post.create!(
    user_id: user_ids.sample,
    content: "テスト投稿#{n}です。\nテスト投稿#{n}です。\nテスト投稿#{n}です。"
  )
  post_ids << post.id

  liking_user_ids = user_ids.reject { |id| id == post.user.id }.sample(rand(USER_COUNT - 5))
  liking_user_ids.each { |id| Like.create!(user_id: id, post_id: post.id) }

  reposting_user_ids = user_ids.reject { |id| id == post.user.id }.sample(rand(USER_COUNT - 5))
  reposting_user_ids.each { |id| Repost.create!(user_id: id, post_id: post.id) }

  bookmarking_user_ids = user_ids.reject { |id| id == post.user.id }.sample(rand(USER_COUNT - 5))
  bookmarking_user_ids.each { |id| Bookmark.create!(user_id: id, post_id: post.id) }

  rand(0..15).times do |m|
    Comment.create!(
      user_id: user_ids.reject { |id| id == post.user_id }.sample,
      post_id: post.id,
      content: "#{post.user.name}さん、投稿#{n}に対するコメント#{m}です"
    )
  end
end

user_ids.each do |user_id|
  followee_ids = user_ids.reject { |id| id == user_id }.sample(rand(USER_COUNT - 1))
  followee_ids.each { |followee_id| Follow.create!(follower_id: user_id, followee_id:) }
end
