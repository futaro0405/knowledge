## 404ページ実装
### ルーティング追加
最後に追加
```ruby:config/routes.rb
...
	get '*not_found' => 'application#routing_error'
	post '*not_found' => 'application#routing_error'
```
### アクションの追加
```ruby:app/controller/a
class ApplicationController < ActionController::Base
	unless Rails.env.development?
    rescue_from Exception,                      with: :_render_500
    rescue_from ActiveRecord::RecordNotFound,   with: :_render_404
    rescue_from ActionController::RoutingError, with: :_render_404
  end

  def routing_error
    raise ActionController::RoutingError, params[:path]
  end

  private
    def _render_404(e = nil)
      logger.info "Rendering 404 with excaption: #{e.message}" if e

      if request.format.to_sym == :json
        render json: { error: "404 Not Found" }, status: :not_found
      else
        render "errors/404.html", status: :not_found, layout: "error"
      end
    end

    def _render_500(e = nil)
      logger.error "Rendering 500 with excaption: #{e.message}" if e

      if request.format.to_sym == :json
        render json: { error: "500 Internal Server Error" }, status: :internal_server_error
      else
        render "errors/500.html", status: :internal_server_error, layout: "error"
      end
    end
end
```
### view追加
`app/views/errors/404.html.rb`、`app/views/errors/500.html.rb`を作成
レイアウト指定がある場合は`app/views/layouts/error/html.erb`を作成