# frozen_string_literal: true

class Admin::Dimension
  DIMENSIONS = {
    languages: Admin::Dimension::LanguagesDimension,
    sources: Admin::Dimension::SourcesDimension,
    servers: Admin::Dimension::ServersDimension,
    space_usage: Admin::Dimension::SpaceUsageDimension,
    software_versions: Admin::Dimension::SoftwareVersionsDimension,
  }.freeze

  def self.retrieve(dimension_keys, start_at, end_at, limit)
    Array(dimension_keys).map { |key| DIMENSIONS[key.to_sym]&.new(start_at, end_at, limit) }.compact
  end
end
