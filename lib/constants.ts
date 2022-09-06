/**
 * clcuenca.dev Constants file. Defines project-wide
 * constants
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

export module Constants {

    /// ---
    /// App

    export const Account = '669680791620'   ;
    export const Region  = 'us-east-1'      ;
    export const AppName = 'clcuenca-dev'   ;

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


}
