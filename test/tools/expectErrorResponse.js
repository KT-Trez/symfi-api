export default function expectErrorResponse(res, status) {
    res.should.have.status(status);
    res.body.should.be.a('object');
    res.body.should.have.property('code');
    res.body.should.have.property('messages');
    res.body.should.have.property('type');

    res.body.should.have.property('messages').length.greaterThan(0);
};