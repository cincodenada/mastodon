# frozen_string_literal: true

class Admin::Measure
  MEASURES = {
    active_users: Admin::Measure::ActiveUsersMeasure,
    new_users: Admin::Measure::NewUsersMeasure,
    interactions: Admin::Measure::InteractionsMeasure,
    opened_reports: Admin::Measure::OpenedReportsMeasure,
    resolved_reports: Admin::Measure::ResolvedReportsMeasure,
  }.freeze

  def self.retrieve(measure_keys, start_at, end_at)
    Array(measure_keys).map { |key| MEASURES[key.to_sym]&.new(start_at, end_at) }.compact
  end
end
