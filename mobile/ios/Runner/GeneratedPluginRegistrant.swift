//
//  GeneratedPluginRegistrant.swift
//  Runner
//
//  This is executed by Xcode as prebuild step and not by Flutter or skipping build step.

import Foundation

// plugin CocoaPods generated methods.
func federated_plugin_user_agent() -> String {
  if let infoDictionary = Bundle.main.infoDictionary,
    let versionString = infoDictionary["CFBundleVersion"] as? String {
    let projectVersion = versionString.isEmpty ? "unknown" : versionString
    let osVersion = UIDevice.current.systemVersion
    let platformString = "iOS \(osVersion)"
    return "Flutter/\(osVersion) (plugins; expense_tracker_mobile/\(projectVersion)) \(platformString)"
  }
  return "Flutter/unknown (plugins)"
}
