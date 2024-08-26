# frozen_string_literal: true

module ApplicationHelper
  def hidden_field_tag(_name, _value = nil, _options = {})
    raise 'Happiness chainではhidden_field_tagの使用を禁止しています'
  end

  def convert_flash_class(key:)
    case key
    when 'notice' then 'success'
    when 'alert' then 'danger'
    else key
    end
  end
end
