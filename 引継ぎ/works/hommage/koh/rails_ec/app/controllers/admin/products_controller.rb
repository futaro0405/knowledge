# frozen_string_literal: true

module Admin
  class ProductsController < Admin::ApplicationController
    before_action :set_product, only: %i[show update destroy]

    def index
      @products = Product.kept.order(created_at: :desc)
    end

    def show; end

    def edit
      @product = Product.kept.find(params[:id])
    end

    def new
      @product = Product.new
    end

    def create
      @product = Product.new(product_params)
      if @product.save
        redirect_to admin_product_path(@product)
      else
        render :new
      end
    end

    def update
      @updated_product = Product.new(product_params)
      # 画像が選択されている場合はその画像を使用。未選択の場合、元の画像を複製して添付する
      product_params['image'] || @updated_product.image.attach(@product.image.blob)

      # 履歴を保存するため、旧レコードをdiscardし更新後の情報を新レコードとして保存する
      if @updated_product.save
        @product.discard
        redirect_to admin_product_path(@updated_product)
      else
        render :edit
      end
    end

    def destroy
      if @product.discard
        flash[:success] = "#{@product.name}の削除が完了しました"
      else
        flash[:danger] = "#{@product.name}の削除に失敗しました"
      end
      redirect_to admin_products_path
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.require(:product).permit(%i[name sku description price stock image])
    end

    def basic_auth
      authenticate_or_request_with_http_basic do |username, password|
        username == ENV['BASIC_AUTH_USER'] && password == ENV['BASIC_AUTH_PASSWORD']
      end
    end
  end
end
