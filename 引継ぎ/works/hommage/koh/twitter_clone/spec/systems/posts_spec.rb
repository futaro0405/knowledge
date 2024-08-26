# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Posts', type: :system do
  describe 'ツイート' do
    let(:user) { create(:user) }

    before do
      user.confirm
      sign_in user
    end

    context '正常系のとき' do
      scenario '投稿' do
        content = 'テスト投稿'

        expect do
          visit root_path
          fill_in 'post[content]', with: content
          click_button 'ツイートする'
        end.to change(user.posts, :count).by 1

        expect(page).to have_content content
      end
    end

    context '異常系のとき' do
      scenario '投稿欄未記入での投稿' do
        expect do
          visit root_path
          fill_in 'post[content]', with: ''
          click_button 'ツイートする'
        end.not_to change(user.posts, :count)

        expect(page).to have_content 'エラーが発生したため 投稿 は保存されませんでした。'
        expect(page).to have_content '投稿内容を入力してください'
      end
    end
  end
end
