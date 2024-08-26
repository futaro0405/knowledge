# frozen_string_literal: true

User.destroy_all

USER_COUNT = 5
POST_COUNT = 50
user_ids = []
post_ids = []

USER_COUNT.times do |n|
  count = n + 1
  user = User.new(
    name: "名前#{count}",
    user_name: "ユーザ名#{count}",
    email: "example#{count}@example.com",
    password: "#{'a' * count}111111",
    introduction: '自己紹介文です',
    place: '東京都',
    website: 'google.com',
    birthdate: '2000-01-01'
  )
  user.skip_confirmation!
  user.save!(context: :not_new_form)
  user_ids << user.id
end

user_ids.each do |user_id|
  other_ids = user_ids.reject { |id| id == user_id }.sample(rand(1...USER_COUNT))

  other_ids.each do |other_id|
    member_ids = [user_id, other_id]
    existing_room = Room.search_existing_room(user_id:, other_id:)
    if existing_room
      room = existing_room
    else
      room = Room.create!
      member_ids.each { |member_id| RoomMember.create!(user_id: member_id, room_id: room.id) }
    end
    rand(1..5).times do |n|
      Message.create!(
        user_id: member_ids.sample,
        room_id: room.id,
        content: (existing_room ? '既存部屋です。' : '') + "テストコメント#{n}です。\nテストコメント#{n}です。\nテストコメント#{n}です。"
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

  Like.create!(
    user_id: user_ids.reject { |id| id == post.user_id }.sample,
    post_id: post.id
  )
  Repost.create!(
    user_id: user_ids.reject { |id| id == post.user_id }.sample,
    post_id: post.id
  )
  Bookmark.create!(
    user_id: user_ids.reject { |id| id == post.user_id }.sample,
    post_id: post.id
  )
  rand(0..5).times do |m|
    Comment.create!(
      user_id: user_ids.reject { |id| id == post.user_id }.sample,
      post_id: post.id,
      content: "#{post.user_name}へ、投稿#{n}に対するコメント#{m}です"
    )
  end
end

user_ids.each do |user_id|
  followee_ids = user_ids.reject { |id| id == user_id }.sample(3)
  followee_ids.each { |followee_id| Follow.create!(follower_id: user_id, followee_id:) }
end
