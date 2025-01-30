# frozen_string_literal: true

# name: discourse-custom-anchor-id
# about: Allows you to specify custom IDs for heading anchor.
# meta_topic_id:
# version: 0.0.1
# authors: Arkshine
# url:
# required_version: 2.7.0

enabled_site_setting :custom_anchor_id_enabled

module ::DiscourseCustomAnchorId
  PLUGIN_NAME = "discourse-custom-anchor-id"
end

require_relative "lib/discourse_custom_anchor_id/engine"
