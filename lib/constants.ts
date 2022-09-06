/**
 * clcuenca.dev Constants file. Defines project-wide
 * constants
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

export module Constants {

    /// ---
    /// App

    export const Account    =   '669680791620'      ;
    export const Region     =   'us-east-1'         ;
    export const AppName    =   'clcuenca-dev'      ;
    export const Domain     =   'clcuenca.dev'      ;
    export const SiteDomain =   `site.${Domain}`    ;

    /// ------
    /// Stages

    export module Stages {

        /// -----
        /// Alpha

        export module Alpha {

            export const Name   =   'Alpha'         ;
            export const Id     =   `${Name}Stage`  ;

        }

    }

    /// ---
    /// ACM

    export module ACM {

        /// -----------
        /// Certificate

        export module Certificate {

            export const Id =   `${AppName}Certificate` ;

        }

    }

    /// -------------
    /// Code Pipeline

    export module CodePipeline {

        export const Id         =   `${AppName}Pipeline`    ;
        export const StackId    =   `${Id}Stack`            ;
        export const SelfMutate =   true                    ;

        /// ---------
        /// ShellStep

        export module ShellStep {

            export const Id     =   `${AppName}ShellStep`   ;

        }

    }

    /// -------
    /// Route53

    export module Route53 {

        /// -----------
        /// Hosted Zone

        export module HostedZone {

            export const Id =   `${AppName}HostedZone`  ;

        }

        /// -------
        /// ARecord

        export module ARecord {

            export const Id =   `${AppName}ARecord`     ;

        }

    }


}
