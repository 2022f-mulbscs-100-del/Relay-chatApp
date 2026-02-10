class HTTP_STATUS {
    static OK = 200;
    static CREATED = 201;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static INTERNAL_SERVER_ERROR = 500;
}

export default HTTP_STATUS;



// we use static cause we don't want to create an instance of
//  this class to access these properties we can directly 
// access them by class name
// Feature 	Instance    method	            Static method
// Belongs  to	        Object (instance)	Class itself
// Access   via	        obj.method()	    Class.method()
// Needs    new?	    ✅	                ❌
// Typical use	Behavior tied to object	Utility/helper functions, constants, factory methods