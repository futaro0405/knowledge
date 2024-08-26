# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーション' do
    let(:user) { create(:user) }

    context '正常系のとき' do
      it 'name,user_name,password,phone,birthdateが入力されている場合、登録できること' do
        user = build(:user)
        expect(user).to be_valid
      end
    end

    context 'nameカラム' do
      it '空欄の場合、登録できないこと' do
        user.name = ''
        expect(user).to be_invalid
      end
    end

    context 'user_nameカラム' do
      it '空欄の場合、登録できないこと' do
        user.user_name = ''
        expect(user).to be_invalid
      end
    end

    context 'emailカラム' do
      it '空欄の場合、登録できないこと' do
        user.email = ''
        expect(user).to be_invalid
      end

      it 'メールアドレスのフォーマットでない場合、登録できないこと' do
        user.email = 'example'
        expect(user).to be_invalid
      end
    end

    context 'passwordカラム' do
      it '空欄の場合、登録できないこと' do
        user.password = ''
        expect(user).to be_invalid
      end

      it '5文字以下のパスワードの場合、登録できないこと' do
        user.password = 'aaaaa'
        user.password_confirmation = 'aaaaa'
        expect(user).to be_invalid
      end
    end

    context 'password_confirmationカラム' do
      it '空欄の場合、登録できないこと' do
        user.password_confirmation = ''
        expect(user).to be_invalid
      end

      it 'passwordとpassword_confirmationが一致しない場合、登録できないこと' do
        user.password = 'aaaaa'
        user.password_confirmation = 'bbbbb'
        expect(user).to be_invalid
      end
    end

    context 'phoneカラム' do
      it '空欄の場合、登録できないこと' do
        user.phone = ''
        expect(user).to be_invalid
      end
    end

    context 'birthdateカラム' do
      it '空欄の場合、登録できないこと' do
        user.birthdate = ''
        expect(user).to be_invalid
      end

      it '日付のフォーマットに一致しない場合、登録できないこと' do
        user.birthdate = '2000'
        expect(user).to be_invalid
      end
    end
  end
end
